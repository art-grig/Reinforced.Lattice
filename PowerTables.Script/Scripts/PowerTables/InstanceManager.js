var PowerTables;
(function (PowerTables) {
    var InstanceManager = (function () {
        function InstanceManager(configuration, masterTable) {
            this.Columns = {};
            this.Plugins = {};
            this._rawColumnNames = [];
            this.Configuration = configuration;
            this._masterTable = masterTable;
        }
        InstanceManager.prototype.initColumns = function () {
            var columns = [];
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c = {
                    Configuration: this.Configuration.Columns[i],
                    RawName: this.Configuration.Columns[i].RawColumnName,
                    MasterTable: null,
                    Header: null,
                    Order: i
                };
                c.Header = {
                    Column: c,
                    renderContent: null,
                    renderElement: null
                };
                this.Columns[c.RawName] = c;
                columns.push(c);
            }
            columns = columns.sort(function (a, b) { return a.Order - b.Order; });
            for (var j = 0; j < columns.length; j++) {
                this._rawColumnNames.push(columns[j].RawName);
            }
            this._events.ColumnsCreation.invoke(this, this.Columns);
        };
        InstanceManager.prototype.initPlugins = function () {
            var pluginsConfiguration = this.Configuration.PluginsConfiguration;
            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                    var conf = pluginsConfiguration[pluginId];
                    var plugin = PowerTables.ComponentsContainer.resolveComponent(conf.PluginId);
                    plugin.init(this._masterTable, conf);
                    this.Plugins[pluginId] = plugin;
                }
            }
        };
        InstanceManager.prototype.getPlugin = function (pluginId, placement) {
            if (!placement)
                placement = 'lt';
            var key = placement + "-" + pluginId;
            if (this.Plugins[key])
                return (this.Plugins[key]);
            else {
                for (var k in this.Plugins) {
                    if (this.Plugins.hasOwnProperty(k)) {
                        var kp = k.substring(0, pluginId.length);
                        if (kp === pluginId)
                            return this.Plugins[k];
                    }
                }
            }
            throw new Error("There is no plugin " + pluginId + " on place " + placement);
        };
        InstanceManager.prototype.getPlugins = function (placement) {
            var result = [];
            for (var k in this.Plugins) {
                if (this.Plugins.hasOwnProperty(k)) {
                    var kp = k.substring(0, placement.length);
                    if (kp === placement) {
                        result.push(this.Plugins[k]);
                    }
                }
            }
            return result;
        };
        InstanceManager.prototype.getColumnFilter = function (columnName) {
            var filterId = 'filter-' + columnName;
            for (var k in this.Plugins) {
                if (this.Plugins.hasOwnProperty(k)) {
                    var kp = k.substring(0, filterId.length);
                    if (kp === filterId)
                        return this.Plugins[k];
                }
            }
            throw new Error("There is no filter for " + columnName);
        };
        InstanceManager.prototype.isDateTime = function (columnName) {
            var tpn = this.Columns[columnName].Configuration.ColumnType;
            return ((tpn === 'DateTime') || (tpn === 'DateTime?'));
        };
        InstanceManager.prototype.getColumnNames = function () {
            return this._rawColumnNames;
        };
        InstanceManager.prototype.getUiColumns = function () {
            var result = [];
            for (var ck in this.Columns) {
                if (this.Columns.hasOwnProperty(ck)) {
                    var col = this.Columns[ck];
                    if (col.Configuration.IsDataOnly)
                        continue;
                    result.push(col);
                }
            }
            result = result.sort(function (a, b) { return a.Order - b.Order; });
            return result;
        };
        InstanceManager.prototype.getColumn = function (columnName) {
            if (!this.Columns.hasOwnProperty(columnName))
                throw new Error("Column " + columnName + " not found for rendering");
            return this.Columns[columnName];
        };
        return InstanceManager;
    })();
    PowerTables.InstanceManager = InstanceManager;
})(PowerTables || (PowerTables = {}));
