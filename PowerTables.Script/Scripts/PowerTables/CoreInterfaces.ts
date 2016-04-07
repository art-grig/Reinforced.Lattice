module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration; 
    
    /**
     * Client filter interface. 
     * This interface is registerable in the DataHolder as 
     * one of the part of filtering pipeline
     */
    export interface IClientFilter {
        
        /**
         * Predicate function that must return 'true' for 
         * row that is actually suitable to be displayed according to 
         * implementor's settings
         * 
         * @param rowObject Row table object
         * @param query Data query
         * @returns True if row is suitable to be shown. False otherwise
         */
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }

    /**
     * Interface for modifying of source data set on client side
     */
    export interface IClientTruncator {
        /**
         * This method should consume source 
         * data set and produce resulting set. 
         * Here you can truncate results e.g. apply paging.
         * 
         * By technical reasons it can be only one client selector registered on table. 
         * 
         * 
         * @param sourceDataSet Array of data objects received from server
         * @param query Data query
         */
        selectData(sourceDataSet: any[], query: IQuery): any[];
    }

    /**
     * Plugin interface
     */
    export interface IPlugin extends IRenderable {

        /**
         * Raw configuration object including Plugin Id
         */
        Configuration: PluginConfiguration;

        /**
         * Plugin Id including placement
         */
        PluginLocation: string;

        /**
         * Beginning of plugin lifecycle
         * 
         * @param masterTable 
         * @param configuration          
         */
        init(masterTable: IMasterTable, configuration: PluginConfiguration): void;

    }

    /**
     * Main table interface for breaking additional dependencies
     */
    export interface IMasterTable {
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
    }
}