declare module PowerTables {
    class PowerTable implements IMasterTable {
        constructor(configuration: Configuration.Json.ITableConfiguration);
        private _isReady;
        private bindReady();
        private _configuration;
        private initialize();
        /**
         * API for working with dates
         */
        Date: DateService;
        /**
         * Reloads table content.
         * This method is left for backward compatibility
         *
         * @returns {}
         */
        reload(force: boolean): void;
        /**
         * API for raising and handling various table events
         */
        Events: EventsManager;
        /**
         * API for managing local data
         */
        DataHolder: DataHolder;
        /**
         * API for data loading
         */
        Loader: Loader;
        /**
         * API for rendering functionality
         */
        Renderer: Rendering.Renderer;
        /**
         * API for locating instances of different components
         */
        InstanceManager: InstanceManager;
        /**
         * API for overall workflow controlling
         */
        Controller: Controller;
        /**
         * API for table messages
         */
        MessageService: MessagesService;
        /**
         * Fires specified DOM event on specified element
         *
         * @param eventName DOM event id
         * @param element Element is about to dispatch event
         */
        static fireDomEvent(eventName: string, element: HTMLElement): void;
        proceedAdjustments(adjustments: PowerTables.Editors.IAdjustmentData): void;
        getStaticData(): any;
        setStaticData(obj: any): void;
    }
}
