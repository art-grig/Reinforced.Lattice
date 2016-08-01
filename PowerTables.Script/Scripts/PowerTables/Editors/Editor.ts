module PowerTables.Editors {

    export class Editor extends PowerTables.Plugins.PluginBase<PowerTables.Editors.IEditorUiConfig> implements IRow {

        //#region IRow members
        public Cells: { [key: string]: ICell } = {};
        public DataObject: any;
        public IsSpecial: boolean = true;
        public Index: number;
        //#endregion

        private _mode: Mode;

        private _activeEditors: PowerTables.Editors.ICellEditor[] = [];
        private _currentDataObjectModified: any;
        private _isEditing: boolean = false;
        private _validationMessages: IValidationMessage[] = [];

        //#region Public interface
        public notifyChanged(editor: PowerTables.Editors.ICellEditor) {
            this.retrieveEditorData(editor);
        }

        public commitAll() {
            this.retrieveAllEditorsData();
            if (this._validationMessages.length > 0) return;

            this._isEditing = false;

            for (var i = 0; i < this._activeEditors.length; i++) {
                this._activeEditors[i].VisualStates.changeState('saving');
                this.finishEditing(this._activeEditors[i], false);
            }
            this.sendDataObjectToServer(() => {
                if (!this._isEditing) this._currentDataObjectModified = null;
            });
        }

        private dispatchEditResponse(editResponse: PowerTables.Editors.IEditionResult, then: () => void) {
            if (then) then();
        }

        private sendDataObjectToServer(then: () => void) {
            this.MasterTable.Loader.requestServer('Edit', (r) => this.dispatchEditResponse(r, then), (q) => {
                q.AdditionalData['Edit'] = JSON.stringify(this._currentDataObjectModified);
                return q;
            });
        }

        public commit(editor: PowerTables.Editors.ICellEditor) {
            var msgs = [];
            this.retrieveEditorData(editor, msgs);
            if (msgs.length !== 0) return;

            if (this._mode === Mode.Cell) {
                editor.VisualStates.changeState('saving');
                this.finishEditing(editor, false);
                this.sendDataObjectToServer(() => {
                    if (!this._isEditing) this._currentDataObjectModified = null;
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

        public redrawMe(editor: PowerTables.Editors.ICellEditor) {
            this.MasterTable.Renderer.Modifier.redrawCell(editor);
            this.setEditorValue(editor);
            this.retrieveEditorData(editor, []);
        }

        private cleanupAfterEdit() {
            this._isEditing = false;
            this._activeEditors = [];
            this.Cells = {};
        }

        public rejectAll() {
            this.cleanupAfterEdit();
            this.MasterTable.Controller.redrawVisibleDataObject(this.DataObject, this.Index);
        }

        private finishEditing(editor: PowerTables.Editors.ICellEditor, redraw: boolean) {
            if (redraw) editor.VisualStates.normalState();
            this._activeEditors.splice(this._activeEditors.indexOf(editor), 1);
            this.Cells[editor.Column.RawName] = this.MasterTable.Controller.produceCell(this.DataObject, editor.Column, this);
            if (redraw) {
                this.MasterTable.Renderer.Modifier.redrawCell(this.Cells[editor.Column.RawName]);
            }
            if (this._activeEditors.length === 0) this.cleanupAfterEdit();
        }

        public reject(editor: PowerTables.Editors.ICellEditor) {
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
        private retrieveEditorData(editor: PowerTables.Editors.ICellEditor, errors?: IValidationMessage[]) {
            var errorsArrayPresent = (!(!errors));
            errors = errors || [];
            this._currentDataObjectModified[editor.Column.RawName] = editor.getValue(errors);
            editor.ValidationMessages = errors;
            if (errors.length > 0) {
                editor.IsValid = false;
                editor.VisualStates.changeState('invalid');
            } else {
                editor.IsValid = true;
                editor.VisualStates.normalState();
            }
            if (!errorsArrayPresent) {
                this._validationMessages.concat(errors);
            }
        }

        private retrieveAllEditorsData() {
            var errors = [];
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.retrieveEditorData(this._activeEditors[i], errors);
            }
            this._validationMessages = errors; //todo draw validation errors
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

        private createEditor(column: IColumn, canComplete: boolean, isForm: boolean, isRow: boolean): PowerTables.Editors.ICellEditor {
            var editorConf = this.Configuration.EditorsForColumns[column.RawName];
            var editor = ComponentsContainer.resolveComponent<PowerTables.Editors.ICellEditor>(editorConf.PluginId);
            editor.DataObject = this.DataObject;
            editor.ModifiedDataObject = this._currentDataObjectModified;

            editor.Column = column;
            editor.CanComplete = canComplete;
            editor.IsFormEdit = isForm;
            editor.IsRowEdit = isRow;
            editor.IsCellEdit = !(isForm || isRow);
            editor.Row = this;
            editor.RawConfig = { Configuration: editorConf, Order: 0, PluginId: editorConf.PluginId, Placement: '', TemplateId: editorConf.TemplateId }
            editor.init(this.MasterTable);
            return editor;
        }

        private beginCellEdit(column: IColumn, rowIndex: number): ICellEditor {
            if (!this.isEditable(column)) return;
            this.ensureEditing(rowIndex);
            var editor = this.createEditor(column, true, false, false);
            this.Cells[column.RawName] = editor;
            this._activeEditors.push(editor);
            var e = this.MasterTable.Renderer.Modifier.redrawCell(editor);
            editor.onAfterRender(e);
            this.setEditorValue(editor);
            editor.focus();
            return editor;
        }

        private beginRowEdit(rowIndex: number) {
            this.ensureEditing(rowIndex);
            for (var k in this.Cells) {
                if (this.Cells.hasOwnProperty(k)) {
                    if (!this.isEditable(this.Cells[k].Column)) {
                        this.Cells[k]['IsEditing'] = true;
                        continue;
                    }
                    var columnName = this.Cells[k].Column.RawName;
                    var editor = this.createEditor(this.Cells[k].Column, false, false, true);
                    this.Cells[columnName] = editor;
                    this._activeEditors.push(editor);
                }
            }
            this.MasterTable.Renderer.Modifier.redrawRow(this);
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.setEditorValue(this._activeEditors[i]);
            }
            if (this._activeEditors.length > 0) this._activeEditors[0].focus();
        }

        private setEditorValue(editor: PowerTables.Editors.ICellEditor) {
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
                this._activeEditors[i].onAfterRender(null);
                this.setEditorValue(this._activeEditors[i]);
            }
        }

        public beginCellEditHandle(e: ICellEventArgs) {
            if (this._isEditing) return;
            this._mode = Mode.Cell;

            var col = this.MasterTable.InstanceManager.getUiColumns()[e.ColumnIndex];
            this.beginCellEdit(col, e.DisplayingRowIndex);
        }

        public beginRowEditHandle(e: IRowEventArgs) {
            if (this._isEditing) return;
            this._mode = Mode.Row;
            this.beginRowEdit(e.DisplayingRowIndex);
        }

        public commitRowEditHandle(e: IRowEventArgs) {

        }

        public rejectRowEditHandle(e: IRowEventArgs) {

        }

        public beginFormEditHandle(e: IRowEventArgs) {

        }

        public commitFormEditHandle(e: IRowEventArgs) {

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