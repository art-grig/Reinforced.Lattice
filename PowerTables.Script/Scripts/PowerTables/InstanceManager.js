var PowerTables;
(function (PowerTables) {
    /**
     * This thing is used to manage instances of columns, plugins etc.
     * It consumes PT configuration as source and provides caller with
     * plugins instances, variable ways to query them and accessing their properties
     */
    var InstanceManager = (function () {
        function InstanceManager(configuration, masterTable, events) {
            /**
             * Dictionary containing current table columns configurations.
             * Key - raw column name. Value - IColumn instance
             */
            this.Columns = {};
            /**
             * Dictionary containing all instances of table plugins.
             * Key - full plugin ID (incl. placement). Value - plugin itself
             */
            this.Plugins = {};
            this._rawColumnNames = [];
            this.Configuration = configuration;
            this._masterTable = masterTable;
            this._events = events;
            this.initColumns();
        }
        InstanceManager.prototype.initColumns = function () {
            var columns = [];
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c = {
                    Configuration: this.Configuration.Columns[i],
                    RawName: this.Configuration.Columns[i].RawColumnName,
                    MasterTable: this._masterTable,
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
                    plugin.PluginLocation = pluginId;
                    plugin.RawConfig = conf;
                    plugin.init(this._masterTable);
                    this.Plugins[pluginId] = plugin;
                }
            }
        };
        InstanceManager.prototype.getPlugin = function (pluginId, placement) {
            if (!placement)
                placement = '';
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
        /**
         * Retrieves plugins list at specific placement
         *
         * @param placement Plugins placement
         * @returns {}
         */
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
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID
         * @param placement Pluign placement
         * @returns {}
         */
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
        /**
         * Determines is column of DateTime type or not
         * @param columnName Column name
         * @returns {}
         */
        InstanceManager.prototype.isDateTime = function (columnName) {
            var tpn = this.Columns[columnName].Configuration.ColumnType;
            return ((tpn === 'DateTime') || (tpn === 'DateTime?'));
        };
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        InstanceManager.prototype.getColumnNames = function () {
            return this._rawColumnNames;
        };
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        InstanceManager.prototype.getUiColumnNames = function () {
            var result = [];
            var uiCol = this.getUiColumns();
            for (var i = 0; i < uiCol.length; i++) {
                result.push(uiCol[i].RawName);
            }
            return result;
        };
        /**
         * Retreives columns suitable for UI rendering in corresponding order
         *
         * @returns {}
         */
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
        /**
         * Retrieves column by its raw name
         *
         * @param columnName Raw column name
         * @returns {}
         */
        InstanceManager.prototype.getColumn = function (columnName) {
            if (!this.Columns.hasOwnProperty(columnName))
                throw new Error("Column " + columnName + " not found for rendering");
            return this.Columns[columnName];
        };
        return InstanceManager;
    })();
    PowerTables.InstanceManager = InstanceManager;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=InstanceManager.js.map