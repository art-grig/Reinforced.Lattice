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
            this._isHandlingSpecialPlacementCase = !(!this.Configuration.EmptyFiltersPlaceholder);
            this._specialCasePlaceholder = this.Configuration.EmptyFiltersPlaceholder;
            this.initColumns();
        }
        /**
         * Attaches datepicker component to HTML element
         *
         * @param element HTML element
         */
        InstanceManager.prototype.createDatePicker = function (element) {
            this.Configuration.DatePickerFunction(element, this.Configuration.ClientDateTimeFormat);
        };
        InstanceManager.prototype.initColumns = function () {
            var columns = [];
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var cnf = this.Configuration.Columns[i];
                var c = {
                    Configuration: cnf,
                    RawName: cnf.RawColumnName,
                    MasterTable: this._masterTable,
                    Header: null,
                    Order: i,
                    IsDateTime: InstanceManager._datetimeTypes.indexOf(cnf.ColumnType) > -1,
                    IsString: InstanceManager._stringTypes.indexOf(cnf.ColumnType) > -1,
                    IsFloat: InstanceManager._floatTypes.indexOf(cnf.ColumnType) > -1,
                    IsInteger: InstanceManager._integerTypes.indexOf(cnf.ColumnType) > -1,
                    IsBoolean: InstanceManager._booleanTypes.indexOf(cnf.ColumnType) > -1,
                    IsEnum: cnf.IsEnum
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
        };
        InstanceManager.prototype.initPlugins = function () {
            var pluginsConfiguration = this.Configuration.PluginsConfiguration;
            var specialCases = {};
            var anySpecialCases = false;
            // registering additional events
            for (var j = 0; j < pluginsConfiguration.length; j++) {
                var epConf = pluginsConfiguration[j];
                PowerTables.ComponentsContainer.registerComponentEvents(epConf.PluginId, this._events, this._masterTable);
            }
            // instantiating and initializing plugins
            for (var l = 0; l < pluginsConfiguration.length; l++) {
                var conf = pluginsConfiguration[l];
                var plugin = PowerTables.ComponentsContainer.resolveComponent(conf.PluginId);
                plugin.PluginLocation = (!conf.Placement) ? conf.PluginId : conf.Placement + "-" + conf.PluginId;
                plugin.RawConfig = conf;
                plugin.Order = conf.Order;
                plugin.init(this._masterTable);
                if (this._isHandlingSpecialPlacementCase && this.startsWith(conf.Placement, this._specialCasePlaceholder)) {
                    specialCases[conf.Placement] = plugin;
                    anySpecialCases = true;
                }
                else {
                    this.Plugins[plugin.PluginLocation] = plugin;
                }
            }
            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                }
            }
            // handling special filters case
            if (this._isHandlingSpecialPlacementCase) {
                if (anySpecialCases) {
                    var columns = this.getUiColumnNames();
                    for (var i = 0; i < columns.length; i++) {
                        var c = columns[i];
                        var id = this._specialCasePlaceholder + "-" + c;
                        var specialPlugin = null;
                        for (var k in specialCases) {
                            if (this.startsWith(k, id)) {
                                specialPlugin = specialCases[k];
                            }
                        }
                        if (specialPlugin == null) {
                            specialPlugin = {
                                PluginLocation: id + "-empty",
                                renderContent: function () { return ''; }
                            };
                        }
                        specialPlugin.Order = i;
                        this.Plugins[specialPlugin.PluginLocation] = specialPlugin;
                    }
                }
            }
            this._events.ColumnsCreation.invoke(this, this.Columns);
        };
        InstanceManager.prototype.startsWith = function (s1, prefix) {
            if (s1 == undefined || s1 === null)
                return false;
            if (prefix.length > s1.length)
                return false;
            if (s1 === prefix)
                return true;
            var part = s1.substring(0, prefix.length);
            return part === prefix;
        };
        InstanceManager.prototype.endsWith = function (s1, postfix) {
            if (s1 == undefined || s1 === null)
                return false;
            if (postfix.length > s1.length)
                return false;
            if (s1 === postfix)
                return true;
            var part = s1.substring(s1.length - postfix.length - 1, postfix.length);
            return part === postfix;
        };
        InstanceManager.prototype.getPlugin = function (pluginId, placement) {
            if (!placement)
                placement = '';
            var key = placement.length === 0 ? pluginId : placement + "-" + pluginId;
            if (this.Plugins[key])
                return (this.Plugins[key]);
            else {
                for (var k in this.Plugins) {
                    if (this.Plugins.hasOwnProperty(k)) {
                        var plg = this.Plugins[k];
                        if (this.startsWith(plg.RawConfig.PluginId, pluginId))
                            return plg;
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
            result.sort(function (a, b) {
                return a.Order - b.Order;
            });
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
        InstanceManager._datetimeTypes = ['DateTime', 'DateTime?'];
        InstanceManager._stringTypes = ['String'];
        InstanceManager._floatTypes = ['Single', 'Double', 'Decimal', 'Single?', 'Double?', 'Decimal?'];
        InstanceManager._integerTypes = ['Int32', 'Int64', 'Int16', 'SByte', 'Byte', 'UInt32', 'UInt64', 'UInt16', 'Int32?', 'Int64?', 'Int16?', 'SByte?', 'Byte?', 'UInt32?', 'UInt64?', 'UInt16?'];
        InstanceManager._booleanTypes = ['Boolean', 'Boolean?'];
        return InstanceManager;
    })();
    PowerTables.InstanceManager = InstanceManager;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=InstanceManager.js.map