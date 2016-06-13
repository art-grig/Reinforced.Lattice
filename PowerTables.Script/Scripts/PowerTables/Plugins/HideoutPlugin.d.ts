declare module PowerTables.Plugins {
    interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
        DoesNotExists: boolean;
    }
    class HideoutPlugin extends PluginBase<PowerTables.Plugins.Hideout.IHideoutPluginConfiguration> implements IQueryPartProvider {
        ColumnStates: IColumnState[];
        private _columnStates;
        private _isInitializing;
        isColumnVisible(columnName: string): boolean;
        isColumnInstanceVisible(col: IColumn): boolean;
        hideColumnByName(rawColname: string): void;
        showColumnByName(rawColname: string): void;
        toggleColumn(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        showColumn(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        hideColumn(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        toggleColumnByName(columnName: string): boolean;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        hideColumnInstance(c: IColumn): void;
        showColumnInstance(c: IColumn): void;
        private onBeforeDataRendered();
        private onDataRendered();
        private onLayourRendered();
        init(masterTable: IMasterTable): void;
        renderContent(templatesProvider: ITemplatesProvider): string;
        subscribe(e: EventsManager): void;
        private ifColVisibleHelper(columnName, opts);
        registerAdditionalHelpers(hb: Handlebars.IHandlebars): void;
    }
}
