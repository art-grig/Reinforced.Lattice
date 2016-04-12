var PowerTables;
(function (PowerTables) {
    /**
     * Component that is responsible for querying server
     */
    var Loader = (function () {
        function Loader(staticData, operationalAjaxUrl, events, dataHolder) {
            this._queryPartProviders = [];
            this._isFirstTimeLoading = false;
            this._staticData = staticData;
            this._operationalAjaxUrl = operationalAjaxUrl;
            this._events = events;
            this._dataHolder = dataHolder;
        }
        /**
         * Registers new query part provider to be used while collecting
         * query data before sending it to server.
         *
         * @param provider instance implementing IQueryPartProvider interface
         * @returns {}
         */
        Loader.prototype.registerQueryPartProvider = function (provider) {
            this._queryPartProviders.push(provider);
        };
        Loader.prototype.gatherQuery = function (queryScope) {
            var a = {
                Paging: {
                    PageSize: 0,
                    PageIndex: 0
                },
                Orderings: {},
                Filterings: {},
                AdditionalData: {},
                StaticDataJson: this._staticData
            };
            if (queryScope === PowerTables.QueryScope.Client) {
                this._events.BeforeClientQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            }
            else {
                this._events.BeforeQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            }
            for (var i = 0; i < this._queryPartProviders.length; i++) {
                this._queryPartProviders[i].modifyQuery(a, queryScope);
            }
            if (queryScope === PowerTables.QueryScope.Client) {
                this._events.AfterClientQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            }
            else {
                this._events.AfterQueryGathering.invoke(this, { Query: a, Scope: queryScope });
            }
            return a;
        };
        Loader.prototype.getXmlHttp = function () {
            if (this._previousRequest) {
                this._previousRequest.abort();
                this._previousRequest = null;
            }
            var xmlhttp;
            try {
                xmlhttp = new ActiveXObject('Msxml2.XMLHTTP');
            }
            catch (e) {
                try {
                    xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
                }
                catch (E) {
                    xmlhttp = false;
                }
            }
            if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
                xmlhttp = new XMLHttpRequest();
            }
            this._previousRequest = xmlhttp;
            return xmlhttp;
        };
        Loader.prototype.doServerQuery = function (data, clientQuery, callback) {
            var _this = this;
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
            req[reqEvent] = (function () {
                if (req.readyState != 4)
                    return false;
                if (req.status === 200) {
                    var ctype = req.getResponseHeader('content-type');
                    if (ctype)
                        ctype = ctype.toLowerCase();
                    if (ctype && ctype.indexOf('application/json') >= 0) {
                        var json = JSON.parse(req.responseText);
                        if (data.Command === 'query') {
                            if (json['Success'] != undefined && !json.Success) {
                                _this._events.LoadingError.invoke(_this, {
                                    Request: data,
                                    XMLHttp: req,
                                    Reason: json.Message,
                                    StackTrace: json['ExceptionStackTrace']
                                });
                            }
                            else {
                                _this._events.DataReceived.invoke(_this, {
                                    Request: data,
                                    XMLHttp: req,
                                    Data: json
                                });
                                _this._dataHolder.storeResponse(json, clientQuery);
                                callback(json);
                            }
                            _this._previousQueryString = JSON.stringify(data.Query);
                        }
                        else {
                            _this._events.DataReceived.invoke(_this, {
                                Request: data,
                                XMLHttp: req,
                                Data: json
                            }); //?
                            callback(json);
                        }
                    }
                    else {
                        if (ctype && ctype.indexOf('lattice/service') >= 0) {
                            if (req.responseText.indexOf('$Token=') === 0) {
                                var token = req.responseText.substr(7, req.responseText.length - 7);
                                _this._events.DeferredDataReceived.invoke(_this, {
                                    Request: data,
                                    XMLHttp: req,
                                    Token: token,
                                    DataUrl: _this._operationalAjaxUrl + '?q=' + token
                                });
                                callback({ $isDeferred: true, $url: _this._operationalAjaxUrl + '?q=' + token, $token: token });
                            }
                        }
                    }
                }
                else {
                    if (req.status === 0)
                        return false; // for IE
                    _this._events.LoadingError.invoke(_this, {
                        Request: data,
                        XMLHttp: req,
                        Reason: 'Network error',
                        StackTrace: 'Unable to connect to server to complete query'
                    });
                }
                _this._events.AfterLoading.invoke(_this, {
                    Request: data,
                    XMLHttp: req
                });
            });
            //req.onabort = (e => {
            //    this.Events.AfterLoading.invoke(this, [this]);
            //});
            //failTimeout = setTimeout(() => { req.abort(); this.Renderer.showError('Network error: network unreacheable'); }, 10000);
            req.send(dataText);
        };
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
        Loader.prototype.requestServer = function (command, callback, queryModifier) {
            var scope = PowerTables.QueryScope.Transboundary;
            if (command === 'query')
                scope = PowerTables.QueryScope.Server;
            var serverQuery = this.gatherQuery(scope);
            var clientQuery = null;
            if (command === 'query')
                clientQuery = this.gatherQuery(PowerTables.QueryScope.Client);
            if (queryModifier) {
                queryModifier(serverQuery);
                queryModifier(clientQuery);
            }
            var queriesEqual = (command === 'query') && (JSON.stringify(serverQuery) === this._previousQueryString);
            if (!queriesEqual) {
                var data = {
                    Command: command,
                    Query: serverQuery
                };
                this.doServerQuery(data, clientQuery, callback);
            }
            else {
                this._dataHolder.filterStoredData(clientQuery);
                callback(null);
            }
        };
        return Loader;
    })();
    PowerTables.Loader = Loader;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Loader.js.map