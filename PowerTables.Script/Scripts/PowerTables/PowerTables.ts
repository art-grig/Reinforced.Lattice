
module PowerTables {
    import TableConfiguration = PowerTables.Configuration.Json.ITableConfiguration; /**
     * Main entry point for all tables functionality
     */
    export class PowerTable implements IMasterTable {
        constructor(configuration: TableConfiguration) {
            //todo enqueue ready
        } 

        private _configuration: TableConfiguration;

        private initialize() {
            this.Events = new EventsManager(this);
            this.InstanceManager = new InstanceManager(this._configuration, this);
            var isDt = this.InstanceManager.isDateTime.bind(this.InstanceManager);

            this.DataHolder = new DataHolder(this.InstanceManager.getColumnNames(), isDt, this.Events);
            this.Loader = new Loader(this._configuration.StaticData, this._configuration.OperationalAjaxUrl, this.Events, this.DataHolder);
            this.Renderer = new Rendering.Renderer(this._configuration.TableRootId, "lt", isDt, this.InstanceManager);
        }
        /**
         * API for raising and handling various table events
         */
        public Events: EventsManager;

        /**
         * API for managing local data
         */
        public DataHolder: DataHolder;

        /**
         * API for data loading
         */
        public Loader: Loader;

        /**
         * API for rendering functionality
         */
        public Renderer: Rendering.Renderer;

        /**
         * API for locating instances of different components
         */
        public InstanceManager: InstanceManager;
    }
} 