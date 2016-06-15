module PowerTables.Filters {

    /**
     * Base class for creating filters
     */
    export class FilterBase<T> extends PowerTables.Plugins.PluginBase<T> implements IQueryPartProvider, IClientFilter {

        public modifyQuery(query: IQuery, scope: QueryScope): void {}

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Loader.registerQueryPartProvider(this);
        }

        /**
         * Call this method inside init and override filterPredicate method to make this filter 
         * participate in client-side filtering
         */
        protected itIsClientFilter(): void {
            this.MasterTable.DataHolder.registerClientFilter(this);
        }

        public filterPredicate(rowObject: any, query: IQuery): boolean { throw new Error('Please override this method'); }
    }
}