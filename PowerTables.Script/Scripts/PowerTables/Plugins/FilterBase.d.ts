declare module PowerTables.Plugins {
    /**
     * Base class for creating filters
     */
    class FilterBase<T> extends PluginBase<T> implements IQueryPartProvider, IClientFilter {
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        /**
         * Call this method inside init and override filterPredicate method to make this filter
         * participate in client-side filtering
         */
        protected itIsClientFilter(): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }
}
