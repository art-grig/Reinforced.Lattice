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
        private _previousRequest: XMLHttpRequest;
        private _staticData: any;                           // from ctor
        private _operationalAjaxUrl: string;                // from ctor
        private _events: EventsManager;                     // from ctor
        private _dataHolder: DataHolder;                     // from ctor
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
            this._events.BeforeQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            for (var i = 0; i < this._queryPartProviders.length; i++) {
                this._queryPartProviders[i].modifyQuery(a, queryScope);
            }
            this._events.AfterQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            return a;
        }

        private getXmlHttp() {
            if (this._previousRequest) {
                this._previousRequest.abort();
                this._previousRequest = null;
            }
            var xmlhttp;
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

        private doServerQuery(data: IPowerTableRequest, clientQuery: IQuery, callback: (data: any) => void) {
            var dataText = JSON.stringify(data);
            var req = this.getXmlHttp();

            this._events.BeforeLoading.invoke(this, {
                Request: data,
                XMLHttp: req
            });

            req.open('POST', this._operationalAjaxUrl, 1);
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/json');
            var reqEvent = req.onload ? 'onload' : 'onreadystatechange'; // for IE

            req[reqEvent] = (() => {
                if (req.readyState != 4) return false;

                if (req.status === 200) {
                    var ctype = req.getResponseHeader('content-type');
                    if (ctype) ctype = ctype.toLowerCase();

                    if (ctype && ctype.indexOf('application/json') >= 0) {
                        var json = JSON.parse(req.responseText);
                        if (data.Command === 'query') {
                            if (json['Success'] != undefined && !json.Success) {
                                this._events.LoadingError.invoke(this, {
                                    Request: data,
                                    XMLHttp: req,
                                    Reason: json.Message
                                });
                            } else {
                                this._events.DataReceived.invoke(this, {
                                    Request: data,
                                    XMLHttp: req,
                                    Data: json
                                });
                                this._dataHolder.storeResponse(json, clientQuery);
                                callback(json);
                            }
                            this._previousQueryString = JSON.stringify(data.Query);
                        } else {
                            this._events.DataReceived.invoke(this, {
                                Request: data,
                                XMLHttp: req,
                                Data: json
                            }); //?
                            callback(json);
                        }
                    } else {
                        if (ctype && ctype.indexOf('lattice/service') >= 0) {
                            if (req.responseText.indexOf('$Token=') === 0) {
                                var token = req.responseText.substr(7, req.responseText.length - 7);
                                this._events.DeferredDataReceived.invoke(this, {
                                    Request: data,
                                    XMLHttp: req,
                                    Token: token,
                                    DataUrl: this._operationalAjaxUrl + '?q=' + token
                                });
                                callback({ $isDeferred: true, $url: this._operationalAjaxUrl + '?q=' + token, $token: token });
                            }
                        }
                    }
                } else {
                    if (req.status === 0) return false; // for IE
                    this._events.LoadingError.invoke(this, {
                        Request: data,
                        XMLHttp: req,
                        Reason: 'Network error'
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
         * @returns {} 
         */
        public requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery): void {

            var scope = QueryScope.Transboundary;
            if (command === 'query') scope = QueryScope.Server;

            var serverQuery = this.gatherQuery(scope);

            var clientQuery: IQuery = null;
            if (command === 'query') clientQuery = this.gatherQuery(QueryScope.Client);

            if (queryModifier) {
                queryModifier(serverQuery);
                queryModifier(clientQuery);
            }
            var queriesEqual = (command === 'query') && (JSON.stringify(serverQuery) === this._previousQueryString);

            if (!queriesEqual) {
                var data: IPowerTableRequest = {
                    Command: command,
                    Query: serverQuery
                };

                this.doServerQuery(data, clientQuery, callback);
            } else {
                this._dataHolder.filterRecentData(clientQuery);
                callback(null);
            }
        }
    }
} 