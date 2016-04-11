module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration; 
    
    /**
     * This thing is used to manage instances of columns, plugins etc. 
     * It consumes PT configuration as source and provides caller with 
     * plugins instances, variable ways to query them and accessing their properties
     */
    export class InstanceManager {
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable, events: EventsManager) {
            this.Configuration = configuration;
            this._masterTable = masterTable;
            this._events = events;
            this._isHandlingSpecialPlacementCase = !(!this.Configuration.EmptyFiltersPlaceholder);
            this._specialCasePlaceholder = this.Configuration.EmptyFiltersPlaceholder;

            this.initColumns();
        } 
        
        /**
         * Dictionary containing current table columns configurations.
         * Key - raw column name. Value - IColumn instance
         */
        public Columns: { [key: string]: IColumn } = {};

        /**
         * Dictionary containing all instances of table plugins. 
         * Key - full plugin ID (incl. placement). Value - plugin itself
         */
        public Plugins: { [key: string]: IPlugin } = {};

        /**
         * Events manager
         */
        private _events: EventsManager;

        /**
         * Table configuration
         */
        public Configuration: TableConfiguration;

        /**
         * Attaches datepicker component to HTML element
         * 
         * @param element HTML element         
         */
        public createDatePicker(element: HTMLElement):void {
            this.Configuration.DatePickerFunction(element, this.Configuration.ClientDateTimeFormat);
        }

        private _rawColumnNames: string[] = [];
        private _masterTable: IMasterTable;
        private _isHandlingSpecialPlacementCase: boolean;
        private _specialCasePlaceholder: string;
        private static _datetimeTypes = ['DateTime', 'DateTime?'];
        private static _stringTypes = ['String'];
        private static _floatTypes = ['Single', 'Double', 'Decimal', 'Single?', 'Double?', 'Decimal?'];
        private static _integerTypes = ['Int32', 'Int64', 'Int16', 'SByte', 'Byte', 'UInt32', 'UInt64', 'UInt16', 'Int32?', 'Int64?', 'Int16?', 'SByte?', 'Byte?', 'UInt32?', 'UInt64?', 'UInt16?'];
        private static _booleanTypes = ['Boolean', 'Boolean?'];

        private initColumns(): void {
            var columns: IColumn[] = [];
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var cnf = this.Configuration.Columns[i];
                var c: IColumn = {
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
                    IsEnum: false // todo
                };
                c.Header = {
                    Column: c,
                    renderContent: null,
                    renderElement: null
                };
                this.Columns[c.RawName] = c;
                columns.push(c);
            }
            columns = columns.sort((a: IColumn, b: IColumn) => a.Order - b.Order);
            for (var j = 0; j < columns.length; j++) {
                this._rawColumnNames.push(columns[j].RawName);
            }

        }

        public initPlugins(): void {
            var pluginsConfiguration = this.Configuration.PluginsConfiguration;
            var specialCases: { [key: string]: IPlugin } = {};
            var anySpecialCases = false;

            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                    var conf = pluginsConfiguration[pluginId];
                    var plugin = ComponentsContainer.resolveComponent<IPlugin>(conf.PluginId);
                    plugin.PluginLocation = pluginId;
                    plugin.RawConfig = conf;
                    plugin.Order = conf.Order;

                    plugin.init(this._masterTable);
                    if (this._isHandlingSpecialPlacementCase && this.startsWith(conf.Placement, this._specialCasePlaceholder)) {
                        specialCases[conf.Placement] = plugin;
                        anySpecialCases = true;
                    } else {
                        this.Plugins[pluginId] = plugin;
                    }
                }
            }

            if (this._isHandlingSpecialPlacementCase) {
                if (anySpecialCases) {
                    var columns = this.getUiColumnNames();
                    for (var i = 0; i < columns.length; i++) {
                        var c = columns[i];
                        var id = `${this._specialCasePlaceholder}-${c}`;
                        var specialPlugin = null;
                        for (var k in specialCases) {
                            if (this.startsWith(k, id)) {
                                specialPlugin = specialCases[k];
                            }
                        }
                        if (specialPlugin == null) {
                            specialPlugin = {
                                PluginLocation: `${id}-empty`,
                                renderContent() {
                                    return '';
                                }
                            };
                        }
                        specialPlugin.Order = i;
                        this.Plugins[specialPlugin.PluginLocation] = specialPlugin;
                    }
                }
            }
            this._events.ColumnsCreation.invoke(this, this.Columns);
        }
        private startsWith(s1: string, prefix: string): boolean {
            if (s1 == undefined || s1 === null) return false;
            if (prefix.length > s1.length) return false;
            if (s1 === prefix) return true;

            var part = s1.substring(0, prefix.length);
            return part === prefix;
        }

        private endsWith(s1: string, postfix: string): boolean {
            if (s1 == undefined || s1 === null) return false;
            if (postfix.length > s1.length) return false;
            if (s1 === postfix) return true;

            var part = s1.substring(s1.length - postfix.length - 1, postfix.length);
            return part === postfix;
        }
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID 
         * @param placement Pluign placement
         * @returns {} 
         */
        public getPlugin(pluginId: string, placement?: string): IPlugin;
        public getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin {
            if (!placement) placement = '';
            var key = `${placement}-${pluginId}`;
            if (this.Plugins[key]) return <any>(this.Plugins[key]);
            else {
                for (var k in this.Plugins) {
                    if (this.Plugins.hasOwnProperty(k)) {
                        if (this.startsWith(k, pluginId)) return <any>this.Plugins[k];
                    }
                }
            }
            throw new Error(`There is no plugin ${pluginId} on place ${placement}`);
        }

        /**
         * Retrieves plugins list at specific placement 
         * 
         * @param placement Plugins placement
         * @returns {} 
         */
        public getPlugins(placement: string): IPlugin[] {
            var result: IPlugin[] = [];

            for (var k in this.Plugins) {
                if (this.Plugins.hasOwnProperty(k)) {
                    var kp = k.substring(0, placement.length);
                    if (kp === placement) {
                        result.push(this.Plugins[k]);
                    }
                }
            }
            result.sort((a: IPlugin, b: IPlugin) => {
                return a.Order - b.Order;
            });
            return result;
        }

        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID 
         * @param placement Pluign placement
         * @returns {} 
         */
        public getColumnFilter<TPlugin>(columnName: string): TPlugin {
            var filterId = 'filter-' + columnName;
            for (var k in this.Plugins) {
                if (this.Plugins.hasOwnProperty(k)) {
                    var kp = k.substring(0, filterId.length);
                    if (kp === filterId) return <any>this.Plugins[k];
                }
            }
            throw new Error(`There is no filter for ${columnName}`);
        }

        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {} 
         */
        public getColumnNames(): string[] {
            return this._rawColumnNames;
        }

        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {} 
         */
        public getUiColumnNames(): string[] {
            var result = [];
            var uiCol = this.getUiColumns();
            for (var i = 0; i < uiCol.length; i++) {
                result.push(uiCol[i].RawName);
            }
            return result;
        }

        /**
         * Retreives columns suitable for UI rendering in corresponding order
         * 
         * @returns {} 
         */
        public getUiColumns(): IColumn[] {
            var result = [];
            for (var ck in this.Columns) {
                if (this.Columns.hasOwnProperty(ck)) {
                    var col = this.Columns[ck];
                    if (col.Configuration.IsDataOnly) continue;
                    result.push(col);
                }
            }
            result = result.sort((a, b) => a.Order - b.Order);
            return result;
        }

        /**
         * Retrieves column by its raw name
         * 
         * @param columnName Raw column name
         * @returns {} 
         */
        public getColumn(columnName: string): IColumn {
            if (!this.Columns.hasOwnProperty(columnName))
                throw new Error(`Column ${columnName} not found for rendering`);
            return this.Columns[columnName];
        }
    }
} 