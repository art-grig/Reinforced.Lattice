declare module PowerTables.Plugins {
    class Editor extends PluginBase<PowerTables.Editors.IEditorUiConfig> implements IRow {
        Cells: {
            [key: string]: ICell;
        };
        DataObject: any;
        IsSpecial: boolean;
        Index: number;
        private _mode;
        private _activeEditors;
        private _currentDataObjectModified;
        private _isEditing;
        private _validationMessages;
        notifyChanged(editor: PowerTables.Plugins.Editors.ICellEditor): void;
        commitAll(): void;
        private dispatchEditResponse(editResponse, then);
        private sendDataObjectToServer(then);
        commit(editor: PowerTables.Plugins.Editors.ICellEditor): void;
        redrawEditingRow(collectData: boolean): void;
        redrawMe(editor: PowerTables.Plugins.Editors.ICellEditor): void;
        private cleanupAfterEdit();
        rejectAll(): void;
        private finishEditing(editor, redraw);
        reject(editor: PowerTables.Plugins.Editors.ICellEditor): void;
        private retrieveEditorData(editor, errors?);
        private retrieveAllEditorsData();
        private ensureEditing(rowDisplayIndex);
        private isEditable(column);
        private createEditor(column, canComplete, isForm, isRow);
        private beginCellEdit(column, canComplete, isForm, isRow, rowIndex);
        private setEditorValue(editor);
        onBeforeClientRowsRendering(e: ITableEventArgs<IRow[]>): void;
        onAfterDataRendered(e: any): void;
        beginCellEditHandle(e: ICellEventArgs): void;
        beginRowEditHandle(e: IRowEventArgs): void;
        beginFormEditHandle(e: IRowEventArgs): void;
        commitRowEditHandle(e: IRowEventArgs): void;
        commitFormEditHandle(e: IRowEventArgs): void;
        rejectRowEditHandle(e: IRowEventArgs): void;
        rejectFormEditHandle(e: IRowEventArgs): void;
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
    interface IValidationMessage {
        Message: string;
        Code: string;
    }
}
