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
        RawConfig: PluginConfiguration;

        /**
         * Plugin Id including placement
         */
        PluginLocation: string;

        /**
         * Plugin order among its location
         */
        Order: number;

        /**
         * Beginning of plugin lifecycle
         * 
         * @param masterTable 
         * @param configuration          
         */
        init(masterTable: IMasterTable): void;

        

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

        /**
         * API for overall workflow controlling
         */
        Controller: Controller;
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

    /** Renderable entity */
    export interface IRenderable {
		/**
		* Renders whole element to string using templates provider
		*
		* @param templatesProvider Cached templates provider
		* @returns String containing HTML code for element
		*/
        renderElement?: (templatesProvider: PowerTables.ITemplatesProvider) => string;
		/**
		* Renders element to HTML string using templates provider
		*
		* @param templatesProvider Cached templates provider
		* @returns String containing HTML code for element
		*/
        renderContent?: (templatesProvider: PowerTables.ITemplatesProvider) => string;
    }

    /** Cell object */
    export interface ICell extends PowerTables.IRenderable {
        /** Associated row */
        Row: PowerTables.IRow;
        /** Associated column */
        Column: PowerTables.IColumn;
        /** Data for this specific cell */
        Data: any;
        /** Whole data object associated with this specific cell */
        DataObject: any;
    }

    /**
     * Colun header rendering object
     */
    export interface IColumnHeader extends PowerTables.IRenderable {
        /**
         * Reference to containing column
         */
        Column: PowerTables.IColumn;
    }

    /** 
     * Row object
     */
    export interface IRow extends PowerTables.IRenderable {
        /** 
         * Data object for row 
         */
        DataObject: any;
        /** 
         * Displaying index. 
         * You can obtain data for this particular row from DataHolder 
         * using localLookupDisplayedData method
         */
        Index: number;
        /** 
         * Reference to table object this row belongs to
         */
        MasterTable: IMasterTable;

        /**
         * Cells collection for this particular row
         */
        Cells: { [key: string]: PowerTables.ICell };
    }

    export interface ITemplatesProvider {
        /** Current handlebars.js engine instance */
        HandlebarsInstance: Handlebars.IHandlebars;
		/**
		* Retrieves cached template handlebars function
		*
		* @param templateId Template id
		* @returns Handlebars function
		*/
        getCachedTemplate(templateId: string): (arg: any) => string;
    }

    export interface IColumn {
        /** Raw column name */
        RawName: string;
        /** Column configuration */
        Configuration: PowerTables.Configuration.Json.IColumnConfiguration;
        /** Reference to master table */
        MasterTable: IMasterTable;
        /** Column header */
        Header: IColumnHeader;
        /** Column order (left-to-right) */
        Order: number;

        /**
         * True when column holds DateTime values
         */
        IsDateTime: boolean;

        /**
         * True when column holds Integer numbers
         */
        IsInteger: boolean;

        /**
         * True when column holds floating point
         */
        IsFloat: boolean;

        /**
         * True when column holds strings
         */
        IsString: boolean;

        /**
         * True when column holds enum values
         */
        IsEnum: boolean;

        /**
         * True when column holds boolean
         */
        IsBoolean: boolean;
    }
}