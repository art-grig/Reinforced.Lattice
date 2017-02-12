declare module PowerTables.Plugins.Ordering {
    class OrderingPlugin extends FilterBase<IOrderingConfiguration> {
        private _clientOrderings;
        private _serverOrderings;
        private _boundHandler;
        subscribe(e: EventsManager): void;
        private overrideHeadersTemplates(columns);
        private updateOrdering(columnName, ordering);
        private specifyOrdering(object, ordering);
        private isClient(columnName);
        switchOrderingForColumn(columnName: string): void;
        setOrderingForColumn(columnName: string, ordering: PowerTables.Ordering): void;
        protected nextOrdering(currentOrdering: PowerTables.Ordering): Ordering;
        private makeDefaultOrderingFunction(fieldName);
        init(masterTable: IMasterTable): void;
        private mixinOrderings(orderingsCollection, query);
        modifyQuery(query: IQuery, scope: QueryScope): void;
    }
}
