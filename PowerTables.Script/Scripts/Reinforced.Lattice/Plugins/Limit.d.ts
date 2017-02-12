declare module PowerTables.Plugins {
    class LimitPlugin extends FilterBase<Plugins.Limit.ILimitClientConfiguration> {
        SelectedValue: ILimitSize;
        private _limitSize;
        Sizes: ILimitSize[];
        renderContent(templatesProvider: ITemplatesProvider): string;
        changeLimitHandler(e: Rendering.ITemplateBoundEvent): void;
        changeLimit(limit: number): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        init(masterTable: IMasterTable): void;
        private onColumnsCreation();
    }
    /**
     * Size entry for limit plugin
     */
    interface ILimitSize {
        IsSeparator: boolean;
        Value: number;
        Label: string;
    }
}
