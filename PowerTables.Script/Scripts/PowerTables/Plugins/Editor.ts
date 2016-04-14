module PowerTables.Plugins {
    import CellEditorBase = PowerTables.Plugins.Editors.ICellEditor;
    import EditorUiConfig = PowerTables.Editors.IEditorUiConfig;
    import EditorRefreshMode = PowerTables.Editors.EditorRefreshMode;

    export class Editor extends PluginBase<EditorUiConfig> implements IRow {

        //#region IRow members
        public Cells: { [key: string]: ICell } = {};
        public DataObject: any;
        public IsSpecial: boolean = true;
        public Index: number;
        //#endregion

        private _activeEditors: CellEditorBase[] = [];
        private _currentDataObjectModified: any;
        private _isEditing: boolean = false;
        private _validationErrors: string[];

        //#region Public interface
        public notifyChanged(editor: CellEditorBase) {
            this.retrieveEditorData(editor);
        }

        private retrieveEditorData(editor: CellEditorBase, errors?: string[]) {
            var errorsArrayPresent = (!(!errors));
            errors = errors || [];
            this._currentDataObjectModified[editor.Column.RawName] = editor.getValue(errors);
            if (errors.length > 0) {
                this.MasterTable.Renderer.Modifier.changeState('invalid', editor.VisualStates);
            } else {
                this.MasterTable.Renderer.Modifier.normalState(editor.VisualStates);
            }
            if (!errorsArrayPresent) {
                this._validationErrors = errors;
            }
        }

        private retrieveAllEditorsData() {
            var errors = [];
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.retrieveEditorData(this._activeEditors[i],errors);
            }
            this._validationErrors = errors; //todo draw validation errors
        }

        public commit(editor: CellEditorBase) {
            this.retrieveAllEditorsData();
            if (this._validationErrors.length > 0) {
                return;
            }

            this._isEditing = false;

            for (var cd in this._currentDataObjectModified) {
                if (this._currentDataObjectModified.hasOwnProperty(cd)) {
                    this.DataObject[cd] = this._currentDataObjectModified[cd];
                }
            }

            for (var i = 0; i < this._activeEditors.length; i++) {
                this.MasterTable.Renderer.Modifier.changeState('saving', this._activeEditors[i].VisualStates);
            }

            this.MasterTable.Loader.requestServer('Edit', (response) => {
                var serverObject = response;
                for (var cd in serverObject) {
                    if (serverObject.hasOwnProperty(cd)) {
                        this.DataObject[cd] = serverObject[cd];
                    }
                }
                for (var i = 0; i < this._activeEditors.length; i++) {
                    this.MasterTable.Renderer.Modifier.normalState(this._activeEditors[i].VisualStates);
                }
                switch (this.Configuration.RefreshMode) {
                    case EditorRefreshMode.RedrawCell:
                    case EditorRefreshMode.RedrawRow:
                    case EditorRefreshMode.RedrawAllVisible:
                    case EditorRefreshMode.ReloadFromServer:

                    default:
                }
            }, (q) => {
                    q.AdditionalData['Edit'] = JSON.stringify(this.DataObject);
                    return q;
                });


        }

        public redrawEditingRow() {
            if (!this._isEditing) return;
            this.MasterTable.Renderer.Modifier.redrawRow(this);
            this.retrieveAllEditorsData();
        }

        public reject(editor: CellEditorBase) {
            this._isEditing = false;
            this.MasterTable.Controller.redrawVisibleDataObject(this.DataObject, this.Index);
        }
        //#endregion

        //#region Private members

        private ensureEditing(rowDisplayIndex: number) {
            if (this._isEditing) return;
            var lookup = this.MasterTable.DataHolder.localLookupDisplayedData(rowDisplayIndex);
            this.DataObject = lookup.DataObject;
            this._currentDataObjectModified = {};
            for (var cd in this.DataObject) {
                if (this.DataObject.hasOwnProperty(cd)) {
                    this._currentDataObjectModified[cd] = this.DataObject[cd];
                }
            }
            var row = this.MasterTable.Controller.produceRow(lookup.DataObject, lookup.DisplayedIndex);
            this.Cells = row.Cells;
            this._isEditing = true;
        }

        private isEditable(column: IColumn): boolean {
            return this.Configuration.EditorsForColumns.hasOwnProperty(column.RawName);
        }

        private createEditor(column: IColumn, canComplete: boolean, isForm: boolean, isRow: boolean): CellEditorBase {
            var editorConf = this.Configuration.EditorsForColumns[column.RawName];
            var editor: CellEditorBase = ComponentsContainer.resolveComponent<CellEditorBase>(editorConf.PluginId);
            editor.DataObject = this.DataObject;
            editor.ModifiedDataObject = this._currentDataObjectModified;

            editor.Column = column;
            editor.CanComplete = canComplete;
            editor.IsFormEdit = isForm;
            editor.IsRowEdit = isRow;
            editor.Row = this;
            editor.RawConfig = { Configuration: editorConf, Order: 0, PluginId: editorConf.PluginId, Placement: '' }
            editor.init(this.MasterTable);
            return editor;
        }

        private beginCellEdit(column: IColumn, canComplete: boolean, isForm: boolean, isRow: boolean, rowIndex: number) {
            if (!this.isEditable(column)) return;
            var editor = this.createEditor(column, canComplete, isForm, isRow);
            this.ensureEditing(rowIndex);
            this.redrawEditingRow();
            editor.IsInitialValueSetting = true;
            editor.setValue(this._currentDataObjectModified[editor.Column.RawName]);
            editor.IsInitialValueSetting = false;
            this._activeEditors.push(editor);
            this.Cells[column.RawName] = editor;
        }
        //#endregion

        //#region Event handlers
        public beginCellEditHandle(e: ICellEventArgs) {
            var col = this.MasterTable.InstanceManager.getUiColumns()[e.ColumnIndex];
            this.beginCellEdit(col, true, false, false, e.DisplayingRowIndex);
        }

        public beginRowEditHandle(e: IRowEventArgs) {

        }

        public beginFormEditHandle(e: IRowEventArgs) {

        }

        public commitRowEditHandle(e: IRowEventArgs) {

        }

        public commitFormEditHandle(e: IRowEventArgs) {

        }

        public rejectRowEditHandle(e: IRowEventArgs) {

        }

        public rejectFormEditHandle(e: IRowEventArgs) {

        }
        //#endregion

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