var PowerTables;
(function (PowerTables) {
    var PowerTable = (function () {
        function PowerTable(configuration) {
            var _this = this;
            this.Configuration = configuration;
            this._queryPartProviders = [];
            this.Columns = {};
            this.Renderer = new PowerTables.Renderer(this.Configuration.TableRootId);
            if (!configuration.DatePickerFunction) {
                this.Renderer.createDatepicker = function (a) { };
            }
            else {
                this.Renderer.createDatepicker = function (e) {
                    configuration.DatePickerFunction(e, configuration.ClientDateTimeFormat);
                };
            }
            this.Events = new PowerTables.EventsManager();
            this._data = new PowerTables.DataHolder(this);
            this.Renderer.layout();
            this.initPlugins();
            this.initColumns();
            this.initFilters();
            if (this.Configuration.LoadImmediately) {
                setTimeout(function () { return _this.reload(); }, 10);
            }
        }
        PowerTable.prototype.initColumns = function () {
            this.Renderer.cacheCellsRenderFunctions(this.Configuration.Columns, this.Configuration.DefaultCellElement);
            this.Events.BeforeColumnsRender.invoke(this, [this]);
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c = {
                    Configuration: this.Configuration.Columns[i],
                    Filter: null,
                    MasterTable: this,
                    RawName: this.Configuration.Columns[i].RawColumnName,
                    Elements: [],
                    HeaderElement: null,
                    Fake: false
                };
                this.Events.BeforeColumnHeaderRender.invoke(this, [c]);
                c.HeaderElement = this.Renderer.renderColumnHeader(c);
                this.Columns[c.RawName] = c;
                this.Events.AfterColumnHeaderRender.invoke(this, [c]);
            }
            this.Events.AfterColumnsRender.invoke(this, [this]);
        };
        PowerTable.prototype.initFilters = function () {
            this.Events.BeforeFiltersRender.invoke(this, [this]);
            var columns = this.Columns;
            for (var ci in columns) {
                if (columns.hasOwnProperty(ci)) {
                    var column = columns[ci];
                    this.Events.BeforeFilterRender.invoke(this, [column]);
                    var config = column.Configuration.Filter;
                    if (!config) {
                        var empty = this.Renderer.renderEmptyFilter();
                        column.Filter = ({ Element: empty });
                        this.Events.AfterFilterRender.invoke(this, [column]);
                    }
                    else {
                        var fltr = PowerTables.ComponentsContainer.resolveComponent(config.FilterKey, [column]);
                        fltr.renderTo(this.Renderer.Filters);
                        column.Filter = fltr;
                        this.Events.AfterFilterRender.invoke(this, [column]);
                        this._queryPartProviders.push(fltr);
                    }
                }
            }
            this.Events.AfterFiltersRender.invoke(this, [this]);
        };
        PowerTable.prototype.getPlugin = function (pluginId, placement) {
            if (!placement)
                placement = 'lt';
            if (this._plugins[pluginId + '$' + placement])
                return (this._plugins[pluginId + '$' + placement]);
            else {
                for (var k in this._plugins) {
                    var kp = k.substring(0, pluginId.length);
                    if (kp === pluginId)
                        return this._plugins[k];
                }
            }
            return null;
        };
        PowerTable.prototype.initPlugins = function () {
            this._plugins = {};
            var pluginsConfiguration = this.Configuration.PluginsConfiguration;
            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                    var conf = pluginsConfiguration[pluginId];
                    var plugin = PowerTables.ComponentsContainer.resolveComponent(conf.PluginId);
                    plugin.init(this, conf);
                    this.Renderer.renderPlugin(plugin, conf);
                    this._plugins[pluginId] = plugin;
                    if (plugin.IsQueryModifier) {
                        this._queryPartProviders.push(plugin);
                    }
                }
            }
        };
        PowerTable.prototype.reload = function () {
            var _self = this;
            this.requestServer('query', function (a) { return _self.drawResponse(a); });
        };
        PowerTable.prototype.requestServer = function (command, callback) {
            this.Events.BeforeLoading.invoke(this, [this]);
            var query = this.gatherQuery();
            var data = {
                Command: command,
                Query: query
            };
            var _self = this;
            $.ajax({
                url: this.Configuration.OperationalAjaxUrl,
                traditional: true,
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(data),
                method: 'POST',
                processData: false,
                success: function (data) {
                    if (command === 'query') {
                        if (data['Success'] != undefined && !data.Success) {
                            _self.Renderer.showError(data.Message);
                        }
                        else {
                            _self.Events.DataReceived.invoke(_self, [data]);
                            callback(data);
                        }
                    }
                    else {
                        _self.Events.DataReceived.invoke(_self, [data]); //?
                        callback(data);
                    }
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    _self.Renderer.showError('Network error: server did not respond your request.');
                },
                complete: function () {
                    _self.Events.AfterLoading.invoke(_self, [_self]);
                }
            });
        };
        PowerTable.prototype.isDateTime = function (columnName) {
            var tpn = this.Columns[columnName].Configuration.ColumnType;
            return ((tpn === 'DateTime') || (tpn === 'DateTime?'));
        };
        /*
         * Parses response from server and turns it to objects array
         */
        PowerTable.prototype.parseResponse = function (response) {
            var data = [];
            var obj = {};
            var currentColIndex = 0;
            var currentCol = this.Configuration.RawColumnNames[currentColIndex];
            for (var i = 0; i < response.Data.length; i++) {
                if (this.isDateTime(currentCol)) {
                    if (response.Data[i]) {
                        obj[currentCol] = Date.parse(response.Data[i]);
                    }
                    else {
                        obj[currentCol] = null;
                    }
                }
                else {
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
        };
        PowerTable.prototype.getColumnNames = function () {
            var columnsOrder = this.Configuration.RawColumnNames; // todo!
            var newOrder = [];
            this.Events.ColumnsOrdering.invoke(this, [this, newOrder]);
            if (newOrder.length > 0) {
                columnsOrder = newOrder;
            }
            return columnsOrder;
        };
        PowerTable.prototype.drawResponse = function (response) {
            this.Renderer.clearTableResults();
            var columns = this.Columns;
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
            }
            else {
                for (var i = 0; i < objects.length; i++) {
                    var dataElement = objects[i];
                    var rowElement = $("<" + this.Configuration.DefaultRowElement + " data-index=\"" + i + "\"></" + this.Configuration.DefaultRowElement + ">");
                    var row = {
                        MasterTable: this,
                        DataObject: objects[i],
                        Index: i,
                        Elements: [],
                        Element: rowElement,
                        Fake: false
                    };
                    var columnsOrder = this.getColumnNames();
                    this.Events.BeforeRowDraw.invoke(this, [row]);
                    this._data.storeRow(row);
                    for (var j = 0; j < columnsOrder.length; j++) {
                        var kk = columnsOrder[j];
                        var column = columns[kk];
                        var cell = {
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
        };
        PowerTable.prototype.gatherQuery = function () {
            var a = {
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
        };
        PowerTable.prototype.registerQueryPartProvider = function (provider) {
            this._queryPartProviders.push(provider);
        };
        return PowerTable;
    })();
    PowerTables.PowerTable = PowerTable;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=PowerTable.js.map