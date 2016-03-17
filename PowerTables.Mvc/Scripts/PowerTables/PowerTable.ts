module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    import IHandlebars = Handlebars.IHandlebars;

    export class PowerTable implements IPowerTable {
        constructor(configuration: TableConfiguration) {
            this.Configuration = configuration;
            this._queryPartProviders = [];
            this.Columns = {};
            this.Renderer = new Renderer(this.Configuration.TableRootId);
            if (!configuration.DatePickerFunction) {
                this.Renderer.createDatepicker = (a) => { };
            } else {
                this.Renderer.createDatepicker = function (e: any) {
                    configuration.DatePickerFunction(e, configuration.ClientDateTimeFormat);
                }
            }
            this.Events = new EventsManager();
            this._data = new DataHolder(this);
            this.Renderer.layout();
            this.initPlugins();
            this.initColumns();
            this.initFilters();
            if (this.Configuration.LoadImmediately) {
                setTimeout(() => this.reload(), 10);
            }
        }

        public Events: EventsManager;
        public Filters: { [key: string]: IFilter };
        public Columns: { [key: string]: IColumn };
        public Configuration: TableConfiguration;
        public Renderer: Renderer;
        public Handlebars: IHandlebars;

        private _queryPartProviders: IQueryPartProvider[];
        private _data: DataHolder;
        private _plugins: { [key: string]: IPlugin };

        private initColumns() {
            this.Renderer.cacheCellsRenderFunctions(this.Configuration.Columns, this.Configuration.DefaultCellElement);
            this.Events.BeforeColumnsRender.invoke(this, [this]);
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c: IColumn = {
                    Configuration: this.Configuration.Columns[i],
                    Filter: null,
                    MasterTable: this,
                    RawName: this.Configuration.Columns[i].RawColumnName,
                    Elements: [],
                    HeaderElement: null,
                    Fake: false
                }
                this.Events.BeforeColumnHeaderRender.invoke(this, [c]);
                if (!c.Configuration.IsDataOnly) c.HeaderElement = this.Renderer.renderColumnHeader(c);
                this.Columns[c.RawName] = c;
                this.Events.AfterColumnHeaderRender.invoke(this, [c]);
            }
            this.Events.AfterColumnsRender.invoke(this, [this]);
        }
        private initFilters() {
            this.Events.BeforeFiltersRender.invoke(this, [this]);
            let columns = this.Columns;
            for (var ci in columns) {
                if (columns.hasOwnProperty(ci)) {
                    var column = columns[ci];
                    if (column.Configuration.IsDataOnly) continue;
                    this.Events.BeforeFilterRender.invoke(this, [column]);
                    var config = column.Configuration.Filter;
                    if (!config) {
                        var empty = this.Renderer.renderEmptyFilter();
                        column.Filter = <any>({ Element: empty });
                        this.Events.AfterFilterRender.invoke(this, [column]);
                    }
                    else {
                        var fltr = ComponentsContainer.resolveComponent<IFilter>(config.FilterKey, [column]);
                        fltr.renderTo(this.Renderer.Filters);
                        column.Filter = fltr;

                        this.Events.AfterFilterRender.invoke(this, [column]);
                        this._queryPartProviders.push(fltr);
                    }
                }
            }

            this.Events.AfterFiltersRender.invoke(this, [this]);
        }
        private initPlugins() {
            this._plugins = {};
            let pluginsConfiguration = this.Configuration.PluginsConfiguration;

            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                    var conf = pluginsConfiguration[pluginId];
                    var plugin = ComponentsContainer.resolveComponent<IPlugin>(conf.PluginId);
                    plugin.init(this, conf);
                    this.Renderer.renderPlugin(plugin, conf);
                    this._plugins[pluginId] = plugin;
                    if (plugin.IsQueryModifier) {
                        this._queryPartProviders.push(<any>plugin);
                    }
                }
            }
        }

        public getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin {
            if (!placement) placement = 'lt';
            if (this._plugins[pluginId + '$' + placement]) return <any>(this._plugins[pluginId + '$' + placement]);
            else {
                for (var k in this._plugins) {
                    var kp = k.substring(0, pluginId.length);
                    if (kp === pluginId) return <any>this._plugins[k];
                }
            }
            return null;
        }

        public reload(): void {
            var _self = this;
            this.requestServer('query', (a) => _self.drawResponse(a));
        }
        
        private _previousRequest: XMLHttpRequest;

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
            
            req.open('POST', this.Configuration.OperationalAjaxUrl, 1);
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
                                callback({ $isDeferred: true, $url: this.Configuration.OperationalAjaxUrl + '?q=' + token, $token: token });
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

        public isDateTime(columnName: string): boolean {
            var tpn = this.Columns[columnName].Configuration.ColumnType;
            return ((tpn === 'DateTime') || (tpn === 'DateTime?'));
        }

        /*
         * Parses response from server and turns it to objects array
         */
        private parseResponse(response: IPowerTablesResponse): any[] {
            var data = [];
            var obj = {};
            var currentColIndex = 0;
            var currentCol = this.Configuration.RawColumnNames[currentColIndex];

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
                if (currentColIndex >= this.Configuration.RawColumnNames.length) {
                    currentColIndex = 0;
                    data.push(obj);
                    obj = {};
                }
                currentCol = this.Configuration.RawColumnNames[currentColIndex];
            }
            return data;
        }
        public getColumnNames(): string[] {
            var columnsOrder = this.Configuration.RawColumnNames; // todo!
            var newOrder = [];

            this.Events.ColumnsOrdering.invoke(this, [this, newOrder]);

            if (newOrder.length > 0) {
                columnsOrder = newOrder;
            }
            return columnsOrder;
        }
        private drawResponse(response: IPowerTablesResponse) {
            this.Renderer.clearTableResults();
            let columns = this.Columns;
            for (var thisCol in columns) {
                if (columns.hasOwnProperty(thisCol)) {
                    columns[thisCol].Elements = [];
                }
            }

            var objects = this.parseResponse(response);
            this._data.storeResponse(response, objects);
            this.Events.BeforeResponseDrawing.invoke(this, [response]);
            if (objects.length === 0) {
                this.Renderer.renderNoData();
            } else {
                var columnsOrder = this.getColumnNames();

                for (var i = 0; i < objects.length; i++) {
                    var dataElement = objects[i];
                    var rowElement = this.Renderer.renderRow(i);

                    var row: IRow = {
                        MasterTable: this,
                        DataObject: objects[i],
                        Index: i,
                        Elements: [],
                        Element: rowElement,
                        Fake: false
                    };

                   
                    this.Events.BeforeRowDraw.invoke(this, [row]);

                    this._data.storeRow(row);

                    for (var j = 0; j < columnsOrder.length; j++) {
                        var kk = columnsOrder[j];
                        var column = columns[kk];
                        if (column.Configuration.IsDataOnly) continue;

                        var cell: ICell = {
                            Column: column,
                            Data: dataElement[column.RawName],
                            DataObject: dataElement,
                            Row: row,
                            Element: null,
                            Fake: false
                        };

                        this.Events.BeforeCellDraw.invoke(this, [cell]);
                        var element = this.Renderer.renderCell(cell);
                        element.data('pt-cell', cell);
                        cell.Element = element;
                        column.Elements.push(element);
                        row.Elements.push(element);
                        this.Events.AfterCellDraw.invoke(this, [cell]);
                        rowElement = rowElement.append(element);
                    }
                    this.Renderer.appendRow(rowElement);
                    this.Events.AfterRowDraw.invoke(this, [row]);
                }
            }
            this.Events.ResponseDrawing.invoke(this, [response]);
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
                StaticDataJson: this.Configuration.StaticData
            };
            this.Events.BeforeFilterGathering.invoke(this, [a]);
            for (var i = 0; i < this._queryPartProviders.length; i++) {
                this._queryPartProviders[i].modifyQuery(a);
            }
            this.Events.AfterFilterGathering.invoke(this, [a]);
            return a;
        }

        public registerQueryPartProvider(provider: IQueryPartProvider): void {
            this._queryPartProviders.push(provider);
        }
    }
} 