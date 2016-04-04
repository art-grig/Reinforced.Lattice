module PowerTables {
    /**
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
    }
} 