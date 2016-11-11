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
        private _additionalDataReceivers: {[_:string]:IAdditionalDataReceiver[]} = {};

        private _previousRequest: any;
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
        public registerAdditionalDataReceiver(dataKey: string, receiver: IAdditionalDataReceiver) :void {
            if (!this._additionalDataReceivers[dataKey]) {
                this._additionalDataReceivers[dataKey] = [];
            }
            this._additionalDataReceivers[dataKey].push(receiver);
        }

        public prefetchData(data: any[]) {
            var query = this.gatherQuery(QueryScope.Server);
            this._dataHolder.storeResponse(<any>{
                Data: data
            }, query);
            this._previousQueryString = JSON.stringify(query);
        }

        public gatherQuery(queryScope: QueryScope): IQuery {
            var a: IQuery = {
                Paging: {
                    PageSize: 0,
                    PageIndex: 0
                },
                Orderings: {},
                Filterings: {},
                AdditionalData: {},
                StaticDataJson: this._masterTable.InstanceManager.Configuration.StaticData,
                Selection: null

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

        private getXmlHttp() {
            if (this._previousRequest) {
                this._previousRequest.abort();
                this._previousRequest = null;
            }
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
            this._previousRequest = xmlhttp;
            return xmlhttp;
        }

        private _previousQueryString: string;

        private checkError(json: any, data: IPowerTableRequest, req: XMLHttpRequest): boolean {
            if (json['__ZBnpwvibZm'] && json['Success'] != undefined && !json.Success) {
                this._masterTable.MessageService.showMessage(json['Message']);

                this._events.LoadingError.invoke(this, {
                    Request: data,
                    XMLHttp: req,
                    Reason: json.Message
                });
                return true;
            }
            return false;
        }

        private checkMessage(json: any): boolean {
            if (json.Message && json.Message['__Go7XIV13OA']) {
                var msg = <ITableMessage>json.Message;
                this._masterTable.MessageService.showMessage(msg);
                if (msg.Type === MessageType.Banner) return true;
                return false;
            }
            return false;
        }

        private checkAdditionalData(json: any): void {
            if (json.AdditionalData && json.AdditionalData['__TxQeah2p']) {
                var data:{[_:string]:any} = json.AdditionalData['Data'];
                for (var adk in data) {
                    if (!this._additionalDataReceivers[adk]) continue;
                    var receivers = this._additionalDataReceivers[adk];
                    for (var i = 0; i < receivers.length; i++) {
                        receivers[i].handleAdditionalData(data[adk]);
                    }
                }
            }
        }

        private checkEditResult(json: any, data: IPowerTableRequest, req: XMLHttpRequest): boolean {
            if (json['__XqTFFhTxSu']) {
                this._events.DataReceived.invoke(this, {
                    Request: data,
                    XMLHttp: req,
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

        private handleRegularJsonResponse(req: XMLHttpRequest, data: IPowerTableRequest, clientQuery: IQuery, callback: any, errorCallback: any) {
            var json = JSON.parse(req.responseText);
            var error: boolean = this.checkError(json, data, req);
            var message: boolean = this.checkMessage(json);
            if (message) {
                this.checkAdditionalData(json);
                callback(json);
                return;
            }
            var edit: boolean = this.checkEditResult(json, data, req);


            if (edit) {
                this.checkAdditionalData(json);
                callback(json);
                return;
            }
            if (!error) {
                this._events.DataReceived.invoke(this, {
                    Request: data,
                    XMLHttp: req,
                    Data: json
                });
                if (data.Command === 'query') {
                    this._dataHolder.storeResponse(json, clientQuery);
                    this.checkAdditionalData(json);
                    callback(json);
                    data.Query.Selection = null; // selection must not affect query results
                    this._previousQueryString = JSON.stringify(data.Query);
                } else {
                    this.checkAdditionalData(json);
                    callback(json);
                }
            } else {
                this.checkAdditionalData(json);
                if (errorCallback) errorCallback(json);
            }
        }

        private handleDeferredResponse(req: XMLHttpRequest, data: IPowerTableRequest, callback: any) {
            if (req.responseText.indexOf('$Token=') === 0) {
                var token: string = req.responseText.substr(7, req.responseText.length - 7);
                var deferredUrl = this._operationalAjaxUrl + (this._operationalAjaxUrl.indexOf('?') > -1 ? '&' : '?') + 'q=' + token;
                this._events.DeferredDataReceived.invoke(this, {
                    Request: data,
                    XMLHttp: req,
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
        public isLoading() {
            return this._isLoading;
        }
        private doServerQuery(data: IPowerTableRequest, clientQuery: IQuery, callback: (data: any) => void, errorCallback?: (data: any) => void): void {
            this._isLoading = true;
            var dataText: string = JSON.stringify(data);
            var req: XMLHttpRequest = this.getXmlHttp() as XMLHttpRequest;

            this._events.Loading.invokeBefore(this, {
                Request: data,
                XMLHttp: req
            });

            req.open('POST', this._operationalAjaxUrl, true);
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/json');
            var reqEvent: string = req.onload ? 'onload' : 'onreadystatechange'; // for IE

            req[reqEvent] = (() => {
                if (req.readyState !== 4) return false;

                if (req.status === 200) {
                    var ctype: string = req.getResponseHeader('content-type');
                    if (ctype) ctype = ctype.toLowerCase();

                    if (ctype && ctype.indexOf('application/json') >= 0) {
                        this.handleRegularJsonResponse(req, data, clientQuery, callback, errorCallback);
                    } else if (ctype && ctype.indexOf('lattice/service') >= 0) {
                        this.handleDeferredResponse(req, data, callback);
                    }
                } else {
                    if (req.status === 0) return false; // for IE
                    this._events.LoadingError.invoke(this, {
                        Request: data,
                        XMLHttp: req,
                        Reason: 'Network error'
                    });
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
        public requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void {

            var scope: QueryScope = QueryScope.Transboundary;
            if (command === 'query') scope = QueryScope.Server;

            var serverQuery: IQuery = this.gatherQuery(scope);

            var clientQuery: IQuery = null;
            if (command === 'query') clientQuery = this.gatherQuery(QueryScope.Client);

            if (queryModifier) {
                queryModifier(serverQuery);
                if (command === 'query') queryModifier(clientQuery);
            }

            var queriesEqual: boolean = (command === 'query') && (JSON.stringify(serverQuery) === this._previousQueryString);
            this._masterTable.Selection.modifyQuery(serverQuery, scope);
            if (force || !queriesEqual) {

                var data: IPowerTableRequest = {
                    Command: command,
                    Query: serverQuery
                };
                if (this._masterTable.InstanceManager.Configuration.QueryConfirmation) {
                    this._masterTable.InstanceManager.Configuration.QueryConfirmation(data, scope, () => this.doServerQuery(data, clientQuery, callback, errorCallback));
                } else {
                    this.doServerQuery(data, clientQuery, callback, errorCallback);
                }
            } else {
                if (this._masterTable.InstanceManager.Configuration.QueryConfirmation) {
                    this._masterTable.InstanceManager.Configuration.QueryConfirmation({ Command: 'Query', Query: clientQuery }, QueryScope.Client, () => {
                        this._isLoading = true;
                        this._dataHolder.filterStoredData(clientQuery);
                        callback(null);
                        this._isLoading = false;
                    });
                } else {
                    this._isLoading = true;
                    this._dataHolder.filterStoredData(clientQuery);
                    callback(null);
                    this._isLoading = false;
                }
            }
        }
    }
}