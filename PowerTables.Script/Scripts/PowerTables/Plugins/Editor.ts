module PowerTables.Plugins {
    import CellEditorBase = PowerTables.Plugins.Editors.ICellEditor;
    import EditorUiConfig = PowerTables.Editors.IEditorUiConfig;

    export class Editor extends PluginBase<EditorUiConfig> {

        private _canSoloComplete: boolean;

        public notifyChanged(editor: CellEditorBase) {

        }

        public completeEditing(editor: CellEditorBase) {
            if (!this._canSoloComplete) return;

        }

        public beginCellEditHandle(e: ICellEventArgs) {
            var col = this.MasterTable.InstanceManager.getUiColumns()[e.ColumnIndex];
            this.beginCellEdit(col, true, false, false, this.MasterTable.DataHolder.localLookupDisplayedData(e.DisplayingRowIndex));
        }

        private beginCellEdit(column: IColumn, canSolo: boolean, isForm: boolean, isRow: boolean, dataObject: ILocalLookupResult) {
            this._canSoloComplete = canSolo;
            var editorConf = this.Configuration.EditorsForColumns[column.RawName];
            if (!editorConf) return;
            var editor: CellEditorBase = ComponentsContainer.resolveComponent<CellEditorBase>(editorConf.PluginId);
            editor.DataObject = dataObject.DataObject;
            editor.Column = column;
            editor.CanComplete = canSolo;
            editor.IsFormEdit = isForm;
            editor.IsRowEdit = isRow;
            editor.Editor = this;
            editor.RawConfig = { Configuration: editorConf, Order: 0, PluginId: editorConf.PluginId, Placement: '' }
            editor.init(this.MasterTable);
            editor.Row = <any>{ Index: dataObject.DisplayedIndex };
            editor.Data = dataObject.DataObject[column.RawName];
            
            var elem = this.MasterTable.Renderer.Modifier.redrawCell(editor);
            editor.onAfterRender(elem);
        }

        public beginRowEditHandle(e: IRowEventArgs) {
            this._canSoloComplete = false;
        }

        public beginFormEditHandle(e: IRowEventArgs) {
            this._canSoloComplete = false;
        }

        public commitRowEditHandle(e: IRowEventArgs) {
            this._canSoloComplete = false;
        }

        public commitFormEditHandle(e: IRowEventArgs) {
            this._canSoloComplete = false;
        }

        public rejectRowEditHandle(e: IRowEventArgs) {
            this._canSoloComplete = false;
        }

        public rejectFormEditHandle(e: IRowEventArgs) {
            this._canSoloComplete = false;
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = (e) => {
            this.MasterTable.Renderer.Delegator.subscribeCellEvent({
                EventId: this.Configuration.BeginEditEventId,
                Handler: this.beginCellEditHandle.bind(this),
                Selector: '[data-editcell]',
                SubscriptionId: 'editor'
            });

            this.MasterTable.Renderer.Delegator.subscribeRowEvent({
                EventId: this.Configuration.BeginEditEventId,
                Handler: this.beginRowEditHandle.bind(this),
                Selector: '[data-editrow]',
                SubscriptionId: 'editor'
            });

            this.MasterTable.Renderer.Delegator.subscribeRowEvent({
                EventId: this.Configuration.CommitEventId,
                Handler: this.commitRowEditHandle.bind(this),
                Selector: '[data-rowcommit]',
                SubscriptionId: 'editor'
            });

            this.MasterTable.Renderer.Delegator.subscribeRowEvent({
                EventId: this.Configuration.RejectEventId,
                Handler: this.rejectRowEditHandle.bind(this),
                Selector: '[data-rowreject]',
                SubscriptionId: 'editor'
            });

            this.MasterTable.Renderer.Delegator.subscribeRowEvent({
                EventId: this.Configuration.CommitEventId,
                Handler: this.beginRowEditHandle.bind(this),
                Selector: '[data-editform]',
                SubscriptionId: 'editor'
            });
        }
    }
} 