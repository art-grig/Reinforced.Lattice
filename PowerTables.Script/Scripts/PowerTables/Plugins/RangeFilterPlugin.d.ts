declare module PowerTables.Plugins {
    class RangeFilterPlugin extends FilterBase<Filters.Range.IRangeFilterUiConfig> {
        private _filteringIsBeingExecuted;
        private _inpTimeout;
        private _fromPreviousValue;
        private _toPreviousValue;
        private _associatedColumn;
        private _isInitializing;
        FromValueProvider: HTMLInputElement;
        ToValueProvider: HTMLInputElement;
        private getFromValue();
        private getToValue();
        handleValueChanged(): void;
        getFilterArgument(): string;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        filterPredicate(rowObject: any, query: IQuery): boolean;
        afterDrawn: (e: any) => void;
    }
}
