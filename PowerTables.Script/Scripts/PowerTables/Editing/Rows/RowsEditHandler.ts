module PowerTables.Editing.Editors.Cells {
    export class RowsEditHandler extends EditHandlerBase<PowerTables.Editing.Rows.IRowsEditUiConfig> {

        private _isEditing: boolean = false;
        private _activeEditors: IEditor[] = [];
        
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

        private beginRowEdit(rowIndex: number) {
            if (this._isEditing) {
                var lookup = this.MasterTable.DataHolder.localLookupDisplayedData(rowIndex);
                if (this.DataObject !== lookup.DataObject) {
                    this.rejectAll();
                }
            }
            this.ensureEditing(rowIndex);
            for (var k in this.Cells) {
                if (this.Cells.hasOwnProperty(k)) {
                    if (!this.isEditable(this.Cells[k].Column)) {
                        this.Cells[k]['IsEditing'] = true;
                        continue;
                    }
                    var columnName = this.Cells[k].Column.RawName;
                    var editor = this.createEditor(this.Cells[k].Column.RawName, this.Cells[k].Column, false, EditorMode.Row);
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
        
        public afterDrawn: (e: ITableEventArgs<any>) => void = (e) => {
            this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.onBeforeClientRowsRendering.bind(this), 'roweditor');
            this.MasterTable.Events.AfterDataRendered.subscribe(this.onAfterDataRendered.bind(this), 'roweditor');
        }

        public commitAll() {
            var errors = [];
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.retrieveEditorData(this._activeEditors[i], errors);
            }
            this.ValidationMessages = errors; //todo draw validation errors

            if (this.ValidationMessages.length > 0) return;

            this._isEditing = false;

            for (var i = 0; i < this._activeEditors.length; i++) {
                this._activeEditors[i].VisualStates.changeState('saving');
            }
            this._isEditing = false;
            this._activeEditors = [];

            this.sendDataObjectToServer(() => {
                if (!this._isEditing) this.CurrentDataObjectModified = null;
            });
        }

        commit(editor: PowerTables.Editing.IEditor): void {
            var idx = this._activeEditors.indexOf(editor);
            if (this._activeEditors.length > idx + 1) {
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

        notifyChanged(editor: PowerTables.Editing.IEditor): void {
            this.retrieveEditorData(editor);
        }

        public rejectAll() : void {
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.reject(this._activeEditors[i]);
            }
            this._isEditing = false;
            this.CurrentDataObjectModified = null;
            this.Cells = {};
            var di = this.MasterTable.DataHolder.localLookupDisplayedDataObject(this.DataObject);
            if (di.IsCurrentlyDisplaying) {
                //var row = this.MasterTable.Controller.produceRow(this.DataObject, di.DisplayedIndex);
                this.MasterTable.Controller.redrawVisibleDataObject(this.DataObject);
            }

            //this.MasterTable.Renderer.Modifier.redrawRow(row);
        }

        reject(editor: PowerTables.Editing.IEditor): void {
            this.CurrentDataObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
            this.setEditorValue(editor);
        }

        public beginRowEditHandle(e: IRowEventArgs) {
            //if (this._isEditing) return;
            this.beginRowEdit(e.DisplayingRowIndex);
        }

        public commitRowEditHandle(e: IRowEventArgs) {
            if (!this._isEditing) return;
            this.commitAll();
        }

        public rejectRowEditHandle(e: IRowEventArgs) {
            if (!this._isEditing) return;
            this.rejectAll();
        }
    }
    ComponentsContainer.registerComponent('RowsEditHandler', RowsEditHandler);
}