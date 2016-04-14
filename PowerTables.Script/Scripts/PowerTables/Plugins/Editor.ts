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

        private _mode: Mode;

        private _activeEditors: CellEditorBase[] = [];
        private _currentDataObjectModified: any;
        private _isEditing: boolean = false;
        private _validationErrors: string[];

        //#region Public interface
        public notifyChanged(editor: CellEditorBase) {
            this.retrieveEditorData(editor);
        }

        public commitAll() {
            this.retrieveAllEditorsData();
            if (this._validationErrors.length > 0) return;

            this._isEditing = false;
            for (var cd in this._currentDataObjectModified) {
                if (this._currentDataObjectModified.hasOwnProperty(cd)) {
                    this.DataObject[cd] = this._currentDataObjectModified[cd];
                }
            }

            for (var i = 0; i < this._activeEditors.length; i++) {
                this.MasterTable.Renderer.Modifier.changeState('saving', this._activeEditors[i].VisualStates);
            }

            this.sendDataObjectToServer(() => {
                for (var i = 0; i < this._activeEditors.length; i++) {
                    this.finishEditing(this._activeEditors[i], false);
                }
                this.redrawAccordingToSettings();
            });
        }

        private redrawAccordingToSettings(lastColumn?:IColumn) {
            switch (this.Configuration.RefreshMode) {
                case EditorRefreshMode.RedrawCell:
                    // actually do nothing because cell was redrawn 
                    // after commit
                    break;
                case EditorRefreshMode.RedrawRow:
                case EditorRefreshMode.RedrawAllVisible:
                case EditorRefreshMode.ReloadFromServer:

                default:
            }
        }

        private dispatchEditResponse(editResponse:any/*todo*/,then:()=>void) {
            for (var cd in editResponse) {
                if (editResponse.hasOwnProperty(cd)) {
                    this.DataObject[cd] = editResponse[cd];
                }
            }
            then();
        }

        private sendDataObjectToServer(then: () => void) {
            //this.MasterTable.Loader.requestServer('Edit', (r)=>this.dispatchEditResponse(r,then), (q) => {
            //        q.AdditionalData['Edit'] = JSON.stringify(this.DataObject);
            //        return q;
            //    });
        }

        public commit(editor: CellEditorBase) {
            var msgs = [];
            this.retrieveEditorData(editor, msgs);
            if (msgs.length !== 0) return;

            if (this._mode === Mode.Cell) {
                this.DataObject[editor.Column.RawName] = this._currentDataObjectModified[editor.Column.RawName];
                this.MasterTable.Renderer.Modifier.changeState('saving', editor.VisualStates);
                this.sendDataObjectToServer(() => {
                    this.finishEditing(editor, true);
                    this.redrawAccordingToSettings(editor.Column);
                });
            } else {
                var idx = this._activeEditors.indexOf(editor);
                if (this._activeEditors.length < idx + 1) {
                    idx = -1;
                    for (var i = 0; i < this._activeEditors.length; i++) {
                        if (!this._activeEditors[i].IsValid) {
                            idx = i;
                            break;
                        }
                    }
                    if (idx !== -1) this._activeEditors[idx].focus();
                    else {
                        this.commitAll();
                    }
                }
            }
        }

        public redrawEditingRow(collectData: boolean) {
            if (!this._isEditing) return;
            this.MasterTable.Renderer.Modifier.redrawRow(this);
            if (collectData) {
                this.retrieveAllEditorsData();
            }
        }

        private cleanupAfterEdit() {
            this._isEditing = false;
            this._currentDataObjectModified = null;
            this._activeEditors = [];
            this.Cells = {};
        }

        public rejectAll() {
            this.cleanupAfterEdit();
            this.MasterTable.Controller.redrawVisibleDataObject(this.DataObject, this.Index);
        }

        private finishEditing(editor: CellEditorBase, redraw: boolean) {
            this.MasterTable.Renderer.Modifier.normalState(editor.VisualStates);
            this._activeEditors.splice(this._activeEditors.indexOf(editor), 1);
            this.Cells[editor.Column.RawName] = this.MasterTable.Controller.produceCell(this.DataObject, editor.Column, this);
            if (redraw) {
                this.MasterTable.Renderer.Modifier.redrawCell(this.Cells[editor.Column.RawName]);
            }
            if (this._activeEditors.length === 0) this.cleanupAfterEdit();
        }

        public reject(editor: CellEditorBase) {
            if (this._mode === Mode.Cell) {
                this.finishEditing(editor, true);
            }
            else {
                this._currentDataObjectModified[editor.Column.RawName] = this.DataObject[editor.Column.RawName];
                this.setEditorValue(editor);
                editor.getValue([]);
            }
        }
        
        //#endregion

        
        //#region Private members
        private retrieveEditorData(editor: CellEditorBase, errors?: string[]) {
            var errorsArrayPresent = (!(!errors));
            errors = errors || [];
            this._currentDataObjectModified[editor.Column.RawName] = editor.getValue(errors);
            if (errors.length > 0) {
                editor.IsValid = false;
                this.MasterTable.Renderer.Modifier.changeState('invalid', editor.VisualStates);
            } else {
                editor.IsValid = true;
                this.MasterTable.Renderer.Modifier.normalState(editor.VisualStates);
            }
            if (!errorsArrayPresent) {
                this._validationErrors = errors;
            }
        }

        private retrieveAllEditorsData() {
            var errors = [];
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.retrieveEditorData(this._activeEditors[i], errors);
            }
            this._validationErrors = errors; //todo draw validation errors
        }
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
            this.Index = lookup.DisplayedIndex;
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
            this.ensureEditing(rowIndex);
            var editor = this.createEditor(column, canComplete, isForm, isRow);
            this.Cells[column.RawName] = editor;
            this._activeEditors.push(editor);
            this.MasterTable.Renderer.Modifier.redrawCell(editor);
            this.setEditorValue(editor);
        }

        private setEditorValue(editor: CellEditorBase) {
            editor.IsInitialValueSetting = true;
            editor.setValue(this._currentDataObjectModified[editor.Column.RawName]);
            editor.IsInitialValueSetting = false;
        }
        //#endregion

        //#region Event handlers

        public onBeforeClientRowsRendering(e: ITableEventArgs<IRow[]>) {
            if (!this._isEditing) return;
            for (var i = 0; i < e.EventArgs.length; i++) {
                if (e.EventArgs[i].DataObject === this.DataObject) {
                    e.EventArgs[i] = this;
                    this.Index = i;
                }
            }
        }

        public onAfterDataRendered(e: any) {
            if (!this._isEditing) return;
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.setEditorValue(this._activeEditors[i]);
            }
        }

        public beginCellEditHandle(e: ICellEventArgs) {
            if (this._isEditing) return;
            this._mode = Mode.Cell;

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

            this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.onBeforeClientRowsRendering.bind(this), 'editor');
            this.MasterTable.Events.AfterDataRendered.subscribe(this.onAfterDataRendered.bind(this), 'editor');
        }


    }

    enum Mode {
        Cell,
        Row,
        Form
    }
    ComponentsContainer.registerComponent('Editor', Editor);
} 