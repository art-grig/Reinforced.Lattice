module PowerTables {

    /**
     * Component that is responsible for querying server
     */
    export class Loader {
        constructor(staticData: any, operationalAjaxUrl: string, events: EventsManager, dataHolder: DataHolder) {
            this._staticData = staticData;
            this._operationalAjaxUrl = operationalAjaxUrl;
            this._events = events;
            this._dataHolder = dataHolder;
        }

        private _queryPartProviders: IQueryPartProvider[] = [];
        private _previousRequest: any;
        private _staticData: any; // from ctor
        private _operationalAjaxUrl: string; // from ctor
        private _events: EventsManager; // from ctor
        private _dataHolder: DataHolder; // from ctor
        private _isFirstTimeLoading: boolean = false;

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

        private gatherQuery(queryScope: QueryScope): IQuery {
            var a: IQuery = {
                Paging: {
                    PageSize: 0,
                    PageIndex: 0
                },
                Orderings: {},
                Filterings: {},
                AdditionalData: {},
                StaticDataJson: this._staticData
            };
            if (queryScope === QueryScope.Client) {
                this._events.BeforeClientQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            } else {
                this._events.BeforeQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            }

            for (var i: number = 0; i < this._queryPartProviders.length; i++) {
                this._queryPartProviders[i].modifyQuery(a, queryScope);
            }

            if (queryScope === QueryScope.Client) {
                this._events.AfterClientQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            } else {
                this._events.AfterQueryGathering.invoke(this, { Query: a, Scope: queryScope });
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

        private checkError(json: any, data: any, req: any): boolean {
            if (json['__ZBnpwvibZm'] && json['Success'] != undefined && !json.Success) {
                this._events.LoadingError.invoke(this, {
                    Request: data,
                    XMLHttp: req,
                    Reason: json.Message,
                    StackTrace: json['ExceptionStackTrace']
                });
                return true;
            }
            return false;
        }

        private handleRegularJsonResponse(req: any, data: any, clientQuery: any, callback: any, errorCallback: any) {
            var json = JSON.parse(req.responseText);
            var error: boolean = this.checkError(json, data, req);
            if (!error) {
                this._events.DataReceived.invoke(this, {
                    Request: data,
                    XMLHttp: req,
                    Data: json
                });
                if (data.Command === 'query') {
                    this._dataHolder.storeResponse(json, clientQuery);
                    callback(json);
                    this._previousQueryString = JSON.stringify(data.Query);
                } else {
                    callback(json);
                }
            } else {
                if (errorCallback) errorCallback(json);
            }
        }

        private handleDeferredResponse(req: any, data: any, callback: any) {
            if (req.responseText.indexOf('$Token=') === 0) {
                var token: string = req.responseText.substr(7, req.responseText.length - 7);
                this._events.DeferredDataReceived.invoke(this, {
                    Request: data,
                    XMLHttp: req,
                    Token: token,
                    DataUrl: this._operationalAjaxUrl + '?q=' + token
                });
                callback({ $isDeferred: true, $url: this._operationalAjaxUrl + '?q=' + token, $token: token });
            }
        }

        private doServerQuery(data: IPowerTableRequest, clientQuery: IQuery, callback: (data: any) => void, errorCallback?: (data: any) => void): void {
            var dataText: string = JSON.stringify(data);
            var req: any = this.getXmlHttp();

            this._events.BeforeLoading.invoke(this, {
                Request: data,
                XMLHttp: req
            });

            req.open('POST', this._operationalAjaxUrl, 1);
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
                        Reason: 'Network error',
                        StackTrace: 'Unable to connect to server to complete query'
                    });
                }

                this._events.AfterLoading.invoke(this, {
                    Request: data,
                    XMLHttp: req
                });

            });
            //req.onabort = (e => {
            //    this.Events.AfterLoading.invoke(this, [this]);
            //});

            //failTimeout = setTimeout(() => { req.abort(); this.Renderer.showError('Network error: network unreacheable'); }, 10000);


            req.send(dataText);
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
         * @returns {} 
         */
        public requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?:boolean): void {

            var scope: QueryScope = QueryScope.Transboundary;
            if (command === 'query') scope = QueryScope.Server;

            var serverQuery: IQuery = this.gatherQuery(scope);

            var clientQuery: IQuery = null;
            if (command === 'query') clientQuery = this.gatherQuery(QueryScope.Client);

            if (queryModifier) {
                queryModifier(serverQuery);
                queryModifier(clientQuery);
            }
            
            var queriesEqual: boolean = (command === 'query') && (JSON.stringify(serverQuery) === this._previousQueryString);

            if (force||!queriesEqual) {
                var data: IPowerTableRequest = {
                    Command: command,
                    Query: serverQuery
                };

                this.doServerQuery(data, clientQuery, callback, errorCallback);
            } else {
                this._dataHolder.filterStoredData(clientQuery);
                callback(null);
            }
        }
    }
}