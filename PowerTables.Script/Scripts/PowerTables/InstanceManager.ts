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

        public Configuration: TableConfiguration;

        private initColumns() {
            for (var i = 0; i < this.Configuration.Columns.length; i++) {
                var c: IColumn = {
                    Configuration: this.Configuration.Columns[i],
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
    }
} 