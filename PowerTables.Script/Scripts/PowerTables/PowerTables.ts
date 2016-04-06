module PowerTables {
    /**
     * Main entry point for all tables functionality
     */
    export class PowerTable implements IInternalTable {

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