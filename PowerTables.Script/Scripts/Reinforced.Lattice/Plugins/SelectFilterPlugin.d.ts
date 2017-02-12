declare module PowerTables.Plugins {
    class SelectFilterPlugin extends FilterBase<Filters.Select.ISelectFilterUiConfig> {
        FilterValueProvider: HTMLSelectElement;
        private _associatedColumn;
        getArgument(): string;
        getSelectionArray(): string[];
        modifyQuery(query: IQuery, scope: QueryScope): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        handleValueChanged(): void;
        init(masterTable: IMasterTable): void;
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }
}
