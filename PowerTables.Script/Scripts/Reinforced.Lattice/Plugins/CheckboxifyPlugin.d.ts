declare module PowerTables.Plugins {
    class CheckboxifyPlugin extends PluginBase<Plugins.Checkboxify.ICheckboxifyClientConfig> implements IQueryPartProvider {
        private _selectedItems;
        private _visibleAll;
        private _allSelected;
        private _ourColumn;
        ValueColumnName: string;
        private _canSelectAll;
        private _pagingPlugin;
        private _selectables;
        selectAll(selected?: boolean): void;
        private redrawHeader();
        private createColumn();
        private canCheck(dataObject, row);
        getSelection(): string[];
        resetSelection(): void;
        selectByRowIndex(rowIndex: number, select?: boolean): boolean;
        selectByDataObject(dataObject: any, select?: boolean): boolean;
        selectByPredicate(predicate: (dataObject: any) => boolean, select?: boolean): boolean;
        private toggleInternal(dataObject, displayedIndex, select?);
        private afterLayoutRender();
        private beforeRowsRendering(e);
        private enableSelectAll(enabled);
        private onClientReload(e);
        private onServerReload(e);
        private applySelection(a);
        private onBeforeAdjustments(e);
        private onAfterAdjustments(e);
        init(masterTable: IMasterTable): void;
        modifyQuery(query: IQuery, scope: QueryScope): void;
        static registerEvents(e: EventsManager, masterTable: IMasterTable): void;
        subscribe(e: EventsManager): void;
    }
}
