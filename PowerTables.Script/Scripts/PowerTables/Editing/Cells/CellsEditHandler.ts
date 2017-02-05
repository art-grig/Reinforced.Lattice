module PowerTables.Editing.Editors.Cells {
    export class CellsEditHandler extends EditHandlerBase<PowerTables.Editing.Cells.ICellsEditUiConfig>
        implements IAdditionalRowsProvider
    {
        private _isEditing: boolean = false;
        private _activeEditor: IEditor;

        private ensureEditing(loadIndex: number) {
            if (this._isEditing) return;

            this.DataObject = this.MasterTable.DataHolder.StoredData[loadIndex];
            this.CurrentDataObjectModified = {};
            for (var cd in this.DataObject) {
                if (this.DataObject.hasOwnProperty(cd)) {
                    this.CurrentDataObjectModified[cd] = this.DataObject[cd];
                }
            }
            this.MasterTable.Events.Edit.invokeBefore(this, this.CurrentDataObjectModified);
            var row = this.MasterTable.Controller.produceRow(this.DataObject);
            this.Cells = row.Cells;
            this.Index = loadIndex;
            this._isEditing = true;
        }

        private beginCellEdit(column: IColumn, rowIndex: number): PowerTables.Editing.IEditor {
            if (!this.isEditable(column)) return;
            this.ensureEditing(rowIndex);
            var editor = this.createEditor(column.RawName, column, true, EditorMode.Cell);
            this.Cells[column.RawName] = editor;
            this._activeEditor = editor;
            var e = this.MasterTable.Renderer.Modifier.redrawCell(editor);
            editor.onAfterRender(e);
            this.setEditorValue(editor);
            editor.focus();
            return editor;
        }

        public beginCellEditHandle(e: ICellEventArgs) {
            if (this._isEditing) return;
            var col = this.MasterTable.InstanceManager.getColumnByOrder(e.Column);
            this.beginCellEdit(col, e.Row);
            e.Stop = true;
        }

        public onAfterRender(e: any) {
            if (!this._isEditing) return;
            if (this._activeEditor != null) {
                this._activeEditor.onAfterRender(null);
                this.setEditorValue(this._activeEditor);
            }
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = (e) => {
            this.MasterTable.Events.DataRendered.subscribeAfter(this.onAfterRender.bind(this), 'editor');
        }

        commit(editor: PowerTables.Editing.IEditor): void {
            var msgs: IValidationMessage[] = [];
            this.retrieveEditorData(editor, msgs);
            if (msgs.length !== 0) {
                this.MasterTable.Events.EditValidationFailed.invokeAfter(this,
                    <any>{
                        OriginalDataObject: this.DataObject,
                        ModifiedDataObject: this.CurrentDataObjectModified,
                        Messages: msgs
                    });
                return;
            }
            if (editor.VisualStates != null) editor.VisualStates.changeState('saving');
            this.finishEditing(editor, false);

            this.sendDataObjectToServer(() => {
                if (!this._isEditing) {
                    this.MasterTable.Events.Edit.invokeAfter(this, this.CurrentDataObjectModified);
                    this.CurrentDataObjectModified = null;
                }
            });

        }

        private finishEditing(editor: PowerTables.Editing.IEditor, redraw: boolean) {
            if (redraw && editor.VisualStates != null) editor.VisualStates.normalState();
            this._activeEditor = null;
            this.Cells[editor.Column.RawName] = this.MasterTable.Controller.produceCell(this.DataObject, editor.Column, this);
            if (redraw) {
                this.MasterTable.Renderer.Modifier.redrawCell(this.Cells[editor.Column.RawName]);
            }
            this.cleanupAfterEdit();
        }

        private cleanupAfterEdit() {
            this._isEditing = false;
            this._activeEditor = null;
            this.Cells = {};
        }

        notifyChanged(editor: PowerTables.Editing.IEditor): void {
            this.retrieveEditorData(editor);
        }

        reject(editor: PowerTables.Editing.IEditor): void {
            this.finishEditing(editor, true);
        }

        public provide(rows: IRow[]): void {
            if (!this._isEditing) return;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].DataObject === this.DataObject) {
                    rows[i] = this;
                }
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            masterTable.Controller.registerAdditionalRowsProvider(this);
        }
    }
    ComponentsContainer.registerComponent('CellsEditHandler', CellsEditHandler);
} 