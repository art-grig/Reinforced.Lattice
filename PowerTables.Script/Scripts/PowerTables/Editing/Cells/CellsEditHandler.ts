module PowerTables.Editing.Editors.Cells {
    export class CellsEditHandler extends EditHandlerBase<PowerTables.Editing.Cells.ICellsEditUiConfig> {

        
        private _isEditing: boolean = false;
        private _activeEditor: IEditor;

        private ensureEditing(rowDisplayIndex: number) {
            if (this._isEditing) return;
            var lookup = this.MasterTable.DataHolder.localLookupDisplayedData(rowDisplayIndex);
            this.DataObject = lookup.DataObject;
            this.CurrentDataObjectModified = {};
            for (var cd in this.DataObject) {
                if (this.DataObject.hasOwnProperty(cd)) {
                    this.CurrentDataObjectModified[cd] = this.DataObject[cd];
                }
            }
            var row = this.MasterTable.Controller.produceRow(lookup.DataObject, lookup.DisplayedIndex);
            this.Cells = row.Cells;
            this.Index = lookup.DisplayedIndex;
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
            var col = this.MasterTable.InstanceManager.getUiColumns()[e.ColumnIndex];
            this.beginCellEdit(col, e.DisplayingRowIndex);
        }

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
            if (this._activeEditor != null) this._activeEditor.onAfterRender(null);
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = (e) => {
            this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.onBeforeClientRowsRendering.bind(this), 'editor');
            this.MasterTable.Events.AfterDataRendered.subscribe(this.onAfterDataRendered.bind(this), 'editor');
        }

        commit(editor: PowerTables.Editing.IEditor): void {
            var msgs = [];
            this.retrieveEditorData(editor, msgs);
            if (msgs.length !== 0) return;
            editor.VisualStates.changeState('saving');
            this.finishEditing(editor, false);
            this.sendDataObjectToServer(() => {
                if (!this._isEditing) this.CurrentDataObjectModified = null;
            });

        }

        private finishEditing(editor: PowerTables.Editing.IEditor, redraw: boolean) {
            if (redraw) editor.VisualStates.normalState();
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
    }
    ComponentsContainer.registerComponent('CellsEditHandler', CellsEditHandler);
} 