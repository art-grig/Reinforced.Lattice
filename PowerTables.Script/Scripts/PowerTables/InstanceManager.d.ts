declare module PowerTables {
    /**
    * This thing is used to manage instances of columns, plugins etc.
    * It consumes PT configuration as source and provides caller with
    * plugins instances, variable ways to query them and accessing their properties
    */
    class InstanceManager {
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable, events: EventsManager);
        private compileComparisonFunction();
        /**
         * Local objects comparison function based on key fields
         *
         * @param x Local data object 1
         * @param y Local data object 2
         * @returns {Boolean} True if objects are equal with primary key
         */
        DataObjectComparisonFunction: (x: any, y: any) => boolean;
        /**
         * Dictionary containing current table columns configurations.
         * Key - raw column name. Value - IColumn instance
         */
        Columns: {
            [key: string]: IColumn;
        };
        /**
         * Dictionary containing all instances of table plugins.
         * Key - full plugin ID (incl. placement). Value - plugin itself
         */
        Plugins: {
            [key: string]: IPlugin;
        };
        /**
         * Events manager
         */
        private _events;
        /**
         * Table configuration
         */
        Configuration: Configuration.Json.ITableConfiguration;
        private _rawColumnNames;
        private _masterTable;
        private _isHandlingSpecialPlacementCase;
        private _specialCasePlaceholder;
        private static _datetimeTypes;
        private static _stringTypes;
        private static _floatTypes;
        private static _integerTypes;
        private static _booleanTypes;
        static classifyType(fieldType: string): IClassifiedType;
        private initColumns();
        initPlugins(): void;
        private static startsWith(s1, prefix);
        private static endsWith(s1, postfix);
        _subscribeConfiguredEvents(): void;
        /**
        * Reteives plugin at specified placement
        * @param pluginId Plugin ID
        * @param placement Pluign placement
        * @returns {}
        */
        getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin;
        /**
         * Retrieves plugins list at specific placement
         *
         * @param placement Plugins placement
         * @returns {}
         */
        getPlugins(placement: string): IPlugin[];
        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID
         * @param placement Pluign placement
         * @returns {}
         */
        getColumnFilter<TPlugin>(columnName: string): TPlugin;
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getColumnNames(): string[];
        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {}
         */
        getUiColumnNames(): string[];
        /**
         * Retreives columns suitable for UI rendering in corresponding order
         *
         * @returns {}
         */
        getUiColumns(): IColumn[];
        /**
         * Retrieves column by its raw name
         *
         * @param columnName Raw column name
         * @returns {}
         */
        getColumn(columnName: string): IColumn;
    }
    interface IClassifiedType {
        IsDateTime: boolean;
        IsString: boolean;
        IsFloat: boolean;
        IsInteger: boolean;
        IsBoolean: boolean;
        IsNullable: boolean;
    }
}
