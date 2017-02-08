module PowerTables.Services {

    /**
     * Component that is responsible for querying server
     */
    export class LoaderService {

        /*
         * @internal
         */
        constructor(staticData: any, operationalAjaxUrl: string, masterTable: IMasterTable) {
            this._staticData = staticData;
            this._operationalAjaxUrl = operationalAjaxUrl;
            this._masterTable = masterTable;
            this._events = this._masterTable.Events;
            this._dataHolder = this._masterTable.DataHolder;
        }

        private _queryPartProviders: IQueryPartProvider[] = [];
        private _additionalDataReceivers: { [_: string]: IAdditionalDataReceiver[] } = {};


        private _staticData: any; // from ctor
        private _operationalAjaxUrl: string; // from ctor
        private _events: PowerTables.Services.EventsService; // from ctor
        private _dataHolder: PowerTables.Services.DataHolderService; // from ctor
        private _isFirstTimeLoading: boolean = false;
        private _masterTable: IMasterTable;

        /**
         * Registers new query part provider to be used while collecting 
         * query data before sending it to server.
         * 
         * @param provider instance implementing IQueryPartProvider interface
         * @returns {} 
         */
        public registerQueryPartProvider(provider: IQueryPartProvider): void {
            this._queryPartProviders.push(provider);
        }

        /**
         * Registers new object that can handle additional data object from server (if any)
         * 
         * @param dataKey Key of additional data object appearing in additional data dictionary
         * @param receiver Receiver object
         * @returns {} 
         */
        public registerAdditionalDataReceiver(dataKey: string, receiver: IAdditionalDataReceiver): void {
            if (!this._additionalDataReceivers[dataKey]) {
                this._additionalDataReceivers[dataKey] = [];
            }
            this._additionalDataReceivers[dataKey].push(receiver);
        }

        public prefetchData(data: any[]) {
            var clientQuery = this.gatherQuery(QueryScope.Client);
            var serverQuery = this.gatherQuery(QueryScope.Server);
            this._masterTable.Partition.partitionBeforeQuery(serverQuery, clientQuery, false);
            this._dataHolder.storeResponse(<any>{
                Data: data
            }, clientQuery);
            this._previousQueryString = JSON.stringify(clientQuery);
        }

        public gatherQuery(queryScope: QueryScope): IQuery {
            var a: IQuery = {
                Orderings: {},
                Filterings: {},
                AdditionalData: {},
                StaticDataJson: this._masterTable.Configuration.StaticData,
                Selection: null,
                IsBackgroundDataFetch: false,
                Partition: null
            };

            if (queryScope === QueryScope.Client) {
                this._events.ClientQueryGathering.invokeBefore(this, { Query: a, Scope: queryScope });
            } else {
                this._events.QueryGathering.invokeBefore(this, { Query: a, Scope: queryScope });
            }

            for (var i: number = 0; i < this._queryPartProviders.length; i++) {
                this._queryPartProviders[i].modifyQuery(a, queryScope);
            }

            if (queryScope === QueryScope.Client) {
                this._events.ClientQueryGathering.invokeAfter(this, { Query: a, Scope: queryScope });
            } else {
                this._events.QueryGathering.invokeAfter(this, { Query: a, Scope: queryScope });
            }
            return a;
        }

        //#region XMLHTTP
        private _previousRequest: any;
        public createXmlHttp(): any {
            var xmlhttp: boolean | XMLHttpRequest;
            try {
                xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                } catch (E) {
                    xmlhttp = false;
                }
            }
            if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                xmlhttp = new XMLHttpRequest();
            }
            return xmlhttp;
        }

        private _runningBackgroundRequests: XMLHttpRequest[] = [];
        private cancelBackground() {
            for (var i = 0; i < this._runningBackgroundRequests.length; i++) {
                this._runningBackgroundRequests[i].abort();
            }
            this._runningBackgroundRequests = [];
        }
        private getXmlHttp(backgroupd: boolean) {
            if (!backgroupd) {
                if (this._previousRequest) {
                    this._previousRequest.abort();
                    this._previousRequest = null;
                    this.cancelBackground();
                }
            }
            var req = this.createXmlHttp();
            req.open('POST', this._operationalAjaxUrl, true);
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/json');

            if (!backgroupd) this._previousRequest = req;
            else this._runningBackgroundRequests.push(req);

            return req;
        }
        //#endregion

        private _previousQueryString: string;

        //#region Checks and handles
        private checkError(json: any, data: IPowerTableRequest): boolean {
            if (json == null) return false;
            if (json['__ZBnpwvibZm'] && json['Success'] != undefined && !json.Success) {
                this._masterTable.MessageService.showMessage(json['Message']);

                this._events.LoadingError.invoke(this, {
                    Request: data,
                    Reason: json.Message
                });
                return true;
            }
            return false;
        }

        private checkMessage(json: any): boolean {
            if (json == null) return false;
            if (json.Message && json.Message['__Go7XIV13OA']) {
                var msg = <ITableMessage>json.Message;
                this._masterTable.MessageService.showMessage(msg);
                if (msg.Type === MessageType.Banner) return true;
                return false;
            }
            return false;
        }

        private checkAdditionalData(json: any): void {
            if (json == null) return;
            if (json.AdditionalData && json.AdditionalData['__TxQeah2p']) {
                var data: { [_: string]: any } = json.AdditionalData['Data'];
                for (var adk in data) {
                    if (!this._additionalDataReceivers[adk]) continue;
                    var receivers = this._additionalDataReceivers[adk];
                    for (var i = 0; i < receivers.length; i++) {
                        receivers[i].handleAdditionalData(data[adk]);
                    }
                }
            }
        }

        private checkEditResult(json: any, data: IPowerTableRequest): boolean {
            if (json == null) return false;
            if (json['__XqTFFhTxSu']) {
                this._events.DataReceived.invoke(this, {
                    Request: data,
                    Data: json
                });
                this._masterTable.proceedAdjustments(json);
                for (var otherAdj in json.OtherTablesAdjustments) {
                    if (json.OtherTablesAdjustments.hasOwnProperty(otherAdj)) {
                        if (window['__latticeInstances'][otherAdj]) {
                            window['__latticeInstances'][otherAdj].proceedAdjustments(json.OtherTablesAdjustments[otherAdj]);
                        }
                    }
                }
                return true;
            }
            return false;
        }

        private handleRegularJsonResponse(responseText: string, data: IPowerTableRequest, clientQuery: IQuery, callback: any, errorCallback: any) {
            var json = JSON.parse(responseText);
            var error: boolean = this.checkError(json, data);
            var message: boolean = this.checkMessage(json);
            if (message) {
                this.checkAdditionalData(json);
                callback(json);
                return;
            }

            var edit: boolean = this.checkEditResult(json, data);
            if (edit) {
                this.checkAdditionalData(json);
                callback(json);
                return;
            }

            if (!error) {
                this._events.DataReceived.invoke(this, {
                    Request: data,
                    Data: json
                });
                if (data.Command === 'query') {
                    this._dataHolder.storeResponse(json, clientQuery);
                    this.checkAdditionalData(json);
                    callback(json);
                    data.Query.Selection = null; // selection must not affect query results
                    data.Query.Partition = null; // partition also
                    if (!data.Query.IsBackgroundDataFetch) {
                        this._previousQueryString = JSON.stringify(data.Query);
                    }
                } else {
                    this.checkAdditionalData(json);
                    callback(json);
                }
            } else {
                this.checkAdditionalData(json);
                if (errorCallback) errorCallback(json);
            }
        }

        private handleDeferredResponse(responseText: string, data: IPowerTableRequest, callback: any) {
            if (responseText.indexOf('$Token=') === 0) {
                var token: string = responseText.substr(7, responseText.length - 7);
                var deferredUrl = this._operationalAjaxUrl + (this._operationalAjaxUrl.indexOf('?') > -1 ? '&' : '?') + 'q=' + token;
                this._events.DeferredDataReceived.invoke(this, {
                    Request: data,
                    Token: token,
                    DataUrl: deferredUrl
                });
                callback({
                    $isDeferred: true,
                    $url: deferredUrl,
                    $token: token
                });
            }
        }
        //#endregion

        public isLoading() {
            return this._isLoading;
        }


        private doServerQuery(data: IPowerTableRequest, clientQuery: IQuery, callback: (data: any) => void, errorCallback?: (data: any) => void): void {
            this._isLoading = true;
            var req: XMLHttpRequest = this.getXmlHttp(data.Query.IsBackgroundDataFetch) as XMLHttpRequest;
            var dataText: string = JSON.stringify(data);
            this._events.Loading.invokeBefore(this, { Request: data, XMLHttp: req });
            var reqEvent: string = req.onload ? 'onload' : 'onreadystatechange'; // for IE
            req[reqEvent] = (() => {
                if (req.readyState !== 4) return false;

                if (req.status === 200) {
                    var ctype: string = req.getResponseHeader('content-type');
                    if (ctype) ctype = ctype.toLowerCase();

                    if (ctype && ctype.indexOf('application/json') >= 0) {
                        this.handleRegularJsonResponse(req.responseText, data, clientQuery, callback, errorCallback);
                    } else if (ctype && ctype.indexOf('lattice/service') >= 0) {
                        this.handleDeferredResponse(req.responseText, data, callback);
                    } else {
                        if (callback) callback(req.responseText);
                    }
                } else {
                    if (req.status === 0) return false; // for IE
                    this._events.LoadingError.invoke(this, {
                        Request: data,
                        XMLHttp: req,
                        Reason: 'Network error'
                    });
                    if (errorCallback) errorCallback(req.responseText);
                }
                this._isLoading = false;
                this._events.Loading.invokeAfter(this, {
                    Request: data,
                    XMLHttp: req
                });
            });
            //req.onabort = (e => {
            //    alert('hop!');
            //});

            //failTimeout = setTimeout(() => { req.abort(); this.Renderer.showError('Network error: network unreacheable'); }, 10000);

            req.send(dataText);
        }

        private _isLoading = false;

        public query(callback: (data: any) => void,
            queryModifier?: (a: IQuery) => IQuery,
            errorCallback?: (data: any) => void,
            force?: boolean): void {

            var serverQuery: IQuery = this.gatherQuery(QueryScope.Server);
            var clientQuery: IQuery = this.gatherQuery(QueryScope.Client);

            if (queryModifier) {
                queryModifier(serverQuery);
                queryModifier(clientQuery);
            }

            var queriesEqual: boolean = (JSON.stringify(serverQuery) === this._previousQueryString);

            var server = force || !queriesEqual;

            server = this._masterTable.Partition.partitionBeforeQuery(serverQuery, clientQuery, server);
            this._masterTable.Selection.modifyQuery(serverQuery, QueryScope.Server);
            var data: IPowerTableRequest = {
                Command: 'query',
                Query: server ? serverQuery : clientQuery
            };

            if (this._masterTable.Configuration.QueryConfirmation) {
                this._masterTable.Configuration.QueryConfirmation(data, server ? QueryScope.Server : QueryScope.Client, () => {
                    if (server) this.doServerQuery(data, clientQuery, callback, errorCallback);
                    else this.doClientQuery(clientQuery, callback);
                });
            } else {
                if (server) this.doServerQuery(data, clientQuery, callback, errorCallback);
                else this.doClientQuery(clientQuery, callback);
            }
        }

        private doClientQuery(clientQuery: IQuery, callback: (data: any) => void) {
            this._isLoading = true;
            this._dataHolder.filterStoredData(clientQuery, -1);
            callback(null);
            this._isLoading = false;
        }

        /**
         * Sends specified request to server and lets table handle it. 
         * Always use this method to invoke table's server functionality because this method 
         * correctly rises all events, handles errors etc
         * 
         * @param command Query command
         * @param callback Callback that will be invoked after data received
         * @param queryModifier Inline query modifier for in-place query modification
         * @param errorCallback Will be called if error occures
         */
        public command(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void {
            if (command === 'query') {
                this.query(callback, queryModifier, errorCallback, force);
                return;
            }

            var serverQuery: IQuery = this.gatherQuery(QueryScope.Transboundary);
            if (queryModifier) {
                queryModifier(serverQuery);
            }
            this._masterTable.Selection.modifyQuery(serverQuery, QueryScope.Transboundary);

            var data: IPowerTableRequest = {
                Command: command,
                Query: serverQuery
            };
            if (this._masterTable.Configuration.QueryConfirmation) {
                this._masterTable.Configuration.QueryConfirmation(data, QueryScope.Transboundary, () => this.doServerQuery(data, null, callback, errorCallback));
            } else {
                this.doServerQuery(data, null, callback, errorCallback);
            }
        }
    }
}