module PowerTables {
    import TableConfiguration = PowerTables.Configuration.Json.ITableConfiguration; /**
     * This thing is used to manage instances of columns, plugins etc. 
     * It consumes PT configuration as source and provides caller with 
     * plugins instances, variable ways to query them and accessing their properties
     */
    export class InstanceManager {
        /**
         * Dictionary containing current table columns configurations.
         * Key - raw column name. Value - IColumn instance
         */
        public Columns: { [key: string]: IColumn };

        /**
         * Dictionary containing all instances of table plugins. 
         * Key - full plugin ID (incl. placement). Value - plugin itself
         */
        public Plugins: { [key: string]: IPlugin };

        /**
         * Events manager
         */
        private _events: EventsManager;

        /**
         * Table configuration
         */
        public Configuration: TableConfiguration;

        private initColumns() {
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c: IColumn = {
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
            }
            this._events.ColumnsCreation.invoke(this, this.Columns);
        }

        private initPlugins() {
            var pluginsConfiguration = this.Configuration.PluginsConfiguration;

            for (var pluginId in pluginsConfiguration) {
                if (pluginsConfiguration.hasOwnProperty(pluginId)) {
                    var conf = pluginsConfiguration[pluginId];
                    var plugin = ComponentsContainer.resolveComponent<IPlugin>(conf.PluginId);
                    plugin.init(this, conf);
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
        public getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin {
            if (!placement) placement = 'lt';
            if (this.Plugins[pluginId + '-' + placement]) return <any>(this.Plugins[pluginId + '$' + placement]);
            else {
                for (var k in this.Plugins) {
                    var kp = k.substring(0, pluginId.length);
                    if (kp === pluginId) return <any>this.Plugins[k];
                }
            }
            return null;
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
                var kp = k.substring(0, filterId.length);
                if (kp === filterId) return <any>this.Plugins[k];
            }
            return null;
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
         * Retrieves sequential columns names in particular order
         * @returns {} 
         */
        public getColumnNames(): string[] {
            var columnsOrder = this.Configuration.RawColumnNames; // todo!
            var newOrder = [];

            this.Events.ColumnsOrdering.invoke(this, [this, newOrder]);

            if (newOrder.length > 0) {
                columnsOrder = newOrder;
            }
            return columnsOrder;
        }
    }
} 