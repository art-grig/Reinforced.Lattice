module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration; 
    
    /**
     * This thing is used to manage instances of columns, plugins etc. 
     * It consumes PT configuration as source and provides caller with 
     * plugins instances, variable ways to query them and accessing their properties
     */
    export class InstanceManager {
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable,events:EventsManager) {
            this.Configuration = configuration;
            this._masterTable = masterTable;
            this._events = events;
            this.initColumns();
            this.initPlugins();
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

        private _rawColumnNames: string[] = [];
        private _masterTable: IMasterTable;

        private initColumns(): void {
            var columns: IColumn[] = [];
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c: IColumn = {
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
            columns = columns.sort((a: IColumn, b: IColumn) => a.Order - b.Order);
            for (var j = 0; j < columns.length; j++) {
                this._rawColumnNames.push(columns[j].RawName);
            }
            this._events.ColumnsCreation.invoke(this, this.Columns);
        }

        private initPlugins(): void {
            var pluginsConfiguration = this.Configuration.PluginsConfiguration;

            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                    var conf = pluginsConfiguration[pluginId];
                    var plugin = ComponentsContainer.resolveComponent<IPlugin>(conf.PluginId);
                    plugin.init(this._masterTable, conf);
                    plugin.PluginLocation = conf.Placement;
                    this.Plugins[pluginId] = plugin;
                }
            }
        }

        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID 
         * @param placement Pluign placement
         * @returns {} 
         */
        public getPlugin(pluginId: string, placement?: string): IPlugin;
        public getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin {
            if (!placement) placement = 'lt';
            var key = `${placement}-${pluginId}`;
            if (this.Plugins[key]) return <any>(this.Plugins[key]);
            else {
                for (var k in this.Plugins) {
                    if (this.Plugins.hasOwnProperty(k)) {
                        var kp = k.substring(0, pluginId.length);
                        if (kp === pluginId) return <any>this.Plugins[k];
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
         * Determines is column of DateTime type or not
         * @param columnName Column name
         * @returns {} 
         */
        public isDateTime(columnName: string): boolean {
            var tpn = this.Columns[columnName].Configuration.ColumnType;
            return ((tpn === 'DateTime') || (tpn === 'DateTime?'));
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