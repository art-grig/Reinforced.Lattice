module PowerTables {
    export class Loader {
        private _queryPartProviders: IQueryPartProvider[] = [];
        private _previousRequest: XMLHttpRequest;
        private _rawColumnNames: string[]; // from ctor
        private _staticData: any; // from ctor
        private _operationalAjaxUrl: string; //from ctor
        public registerQueryPartProvider(provider: IQueryPartProvider): void {
            this._queryPartProviders.push(provider);
        }

        private gatherQuery(): IQuery {
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
            this.Events.BeforeFilterGathering.invoke(this, [a]);
            for (var i = 0; i < this._queryPartProviders.length; i++) {
                this._queryPartProviders[i].modifyQuery(a);
            }
            this.Events.AfterFilterGathering.invoke(this, [a]);
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

        /*
         * Parses response from server and turns it to objects array
         */
        private parseResponse(response: IPowerTablesResponse): any[] {
            var data = [];
            var obj = {};
            var currentColIndex = 0;
            var currentCol = this._rawColumnNames[currentColIndex];

            for (var i = 0; i < response.Data.length; i++) {
                if (this.isDateTime(currentCol)) {
                    if (response.Data[i]) {
                        obj[currentCol] = Date.parse(response.Data[i]);
                    } else {
                        obj[currentCol] = null;
                    }
                } else {
                    obj[currentCol] = response.Data[i];
                }
                currentColIndex++;
                if (currentColIndex >= this._rawColumnNames.length) {
                    currentColIndex = 0;
                    data.push(obj);
                    obj = {};
                }
                currentCol = this._rawColumnNames[currentColIndex];
            }
            return data;
        }

        public requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery): void {
            this.Events.BeforeLoading.invoke(this, [this]);
            var query = this.gatherQuery();

            if (queryModifier) queryModifier(query);

            var data: IPowerTableRequest = {
                Command: command,
                Query: query
            };
            var dataText = JSON.stringify(data);

            var req = this.getXmlHttp();

            req.open('POST', this._operationalAjaxUrl, 1);
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/json');
            var reqEvent = req.onload ? 'onload' : 'onreadystatechange'; // for IE

            req[reqEvent] = (e => {
                if (req.readyState != 4) return false;
                if (req.status === 200) {
                    var ctype = req.getResponseHeader('content-type');
                    if (ctype) ctype = ctype.toLowerCase();

                    if (ctype && ctype.indexOf('application/json') >= 0) {
                        var json = JSON.parse(req.responseText);
                        if (command === 'query') {
                            if (json['Success'] != undefined && !json.Success) {
                                this.Renderer.showError(json.Message);
                            } else {
                                this.Events.DataReceived.invoke(this, [json]);
                                // todo parse and store data here
                                callback(json);
                            }
                        } else {
                            this.Events.DataReceived.invoke(this, [json]); //?
                            callback(json);
                        }
                    } else {
                        if (ctype && ctype.indexOf('lattice/service') >= 0) {
                            if (req.responseText.indexOf('$Token=') === 0) {
                                var token = req.responseText.substr(7, req.responseText.length - 7);
                                this.Events.AfterLoading.invoke(this, [this]);
                                callback({ $isDeferred: true, $url: this._operationalAjaxUrl + '?q=' + token, $token: token });
                            }
                        }
                    }
                } else {
                    if (req.status === 0) return false; // for IE
                    this.Renderer.showError('Network error');
                }
                this.Events.AfterLoading.invoke(this, [this]);
            });
            //req.onabort = (e => {
            //    this.Events.AfterLoading.invoke(this, [this]);
            //});
            
            //failTimeout = setTimeout(() => { req.abort(); this.Renderer.showError('Network error: network unreacheable'); }, 10000);

            req.send(dataText);
        }
    }
} 