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
     * Plugin interface. 
     * Leave both render functions null to obtain non-displaying plugin
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

    /**
     * This enumeration distinguishes which way 
     * underlying query will be used
     */
    export enum QueryScope {
        /**
         * Mentioned query will be sent to server to obtain 
         * data (probably) for further local filtration. 
         * All locally filtered fields should be excluded from 
         * underlying query
         */
        Server,

        /**
         * Mentioned query will be used for local data filtration. 
         * To gain performance, please exclude all data settings that were 
         * applied during server request
         */
        Client,

        /**
         * This query should contain both data for client and server filtering. 
         * Transboundary queries are used to obtain query settings 
         * that will be used on server side to retrieve data set that 
         * will be used for server command handling, so server needs all filtering settings
         */
        Transboundary
    }

    /**
     * Interface for classes that are available to modify data query
     */
    export interface IQueryPartProvider {

        /**
         * This method is called every time when master table needs 
         * data query for its reasons. You will receive existing query part in 
         * 'query' parameter and query scope denoting which this query will be used for 
         * in 'scope' parameter
         * 
         * @param query Existing query part
         * @param scope Query scope
         * @returns {} 
         */
        modifyQuery(query: PowerTables.IQuery, scope: QueryScope): void;
    }
}