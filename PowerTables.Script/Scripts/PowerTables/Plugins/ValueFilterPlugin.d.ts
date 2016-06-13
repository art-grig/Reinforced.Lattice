declare module PowerTables.Plugins {
    class ValueFilterPlugin extends FilterBase<Filters.Value.IValueFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _previousValue;
        private _associatedColumn;
        private _isInitializing;
        FilterValueProvider: HTMLInputElement;
        private getValue();
        handleValueChanged(): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        init(masterTable: IMasterTable): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        afterDrawn: (e: any) => void;
    }
}
