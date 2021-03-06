﻿module Reinforced.Lattice.Editing.Editors.Cells {
    export class RowsEditHandler extends EditHandlerBase<Reinforced.Lattice.Editing.Rows.IRowsEditUiConfig>
        implements IAdditionalRowsProvider {

        private _isEditing: boolean = false;
        private _activeEditors: IEditor[] = [];
        private _isAddingNewRow: boolean = false;

        public onAfterRender(e: any) {
            if (!this._isEditing) return;
            for (var i = 0; i < this._activeEditors.length; i++) {
                this._activeEditors[i].onAfterRender(null);
                this.setEditorValue(this._activeEditors[i]);
            }
        }

        private ensureEditing(rowIndex: number) {
            if (this._isEditing) return;
            if (rowIndex >= 0) {
                this._isAddingNewRow = false;
                this.DataObject = this.MasterTable.DataHolder.StoredCache[rowIndex];
                this.CurrentDataObjectModified = {};
                for (var cd in this.DataObject) {
                    if (this.DataObject.hasOwnProperty(cd)) {
                        this.CurrentDataObjectModified[cd] = this.DataObject[cd];
                    }
                }
            } else {
                this._isAddingNewRow = true;
                this.DataObject = this.MasterTable.DataHolder.defaultObject();
                this.CurrentDataObjectModified = this.MasterTable.DataHolder.defaultObject();
                for (var i = 0; i < this.Configuration.Fields.length; i++) {
                    if (this.Configuration.Fields[i].PluginId !== 'DisplayEditor') {
                        this.DataObject[this.Configuration.Fields[i].FieldName] = null;
                        this.CurrentDataObjectModified[this.Configuration.Fields[i].FieldName] = null;
                    }
                }
            }
            this.MasterTable.Events.Edit.invokeBefore(this, this.CurrentDataObjectModified);
            var row = this.MasterTable.Controller.produceRow(this.DataObject);
            this.Cells = row.Cells;
            this.Index = rowIndex < 0 ? -1 : rowIndex;
            this._isEditing = true;
        }

        private beginRowEdit(rowIndex: number) {
            if (this._isEditing) {
                var lookup = this.MasterTable.DataHolder.StoredCache[rowIndex];
                if (this.DataObject !== lookup) {
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
            if (rowIndex < 0) {
                this.MasterTable.Renderer.Modifier.prependRow(this);
            } else {
                this.MasterTable.Renderer.Modifier.redrawRow(this);
            }
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.setEditorValue(this._activeEditors[i]);
            }
            if (this._activeEditors.length > 0) this._activeEditors[0].focus();
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = (e) => {
            this.MasterTable.Events.DataRendered.subscribeAfter(this.onAfterRender.bind(this), 'roweditor');
        }

        public commitAll() {
            this.ValidationMessages = [];
            var errors = [];
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.retrieveEditorData(this._activeEditors[i], errors);
            }
            this.ValidationMessages = errors; //todo draw validation errors

            if (this.ValidationMessages.length > 0) {
                this.MasterTable.Events.EditValidationFailed.invokeAfter(this,
                    <any>{
                        OriginalDataObject: this.DataObject,
                        ModifiedDataObject: this.CurrentDataObjectModified,
                        Messages: this.ValidationMessages
                    });
                return;
            }

            this._isEditing = false;

            for (var i = 0; i < this._activeEditors.length; i++) {
                if (this._activeEditors[i].VisualStates != null) this._activeEditors[i].VisualStates.changeState('saving');
            }
            this._isEditing = false;
            this._activeEditors = [];

            this.sendDataObjectToServer(() => {
                if (!this._isEditing) {
                    this.MasterTable.Events.Edit.invokeAfter(this, this.CurrentDataObjectModified);
                    this.CurrentDataObjectModified = null;

                }
            });
        }

        commit(editor: Reinforced.Lattice.Editing.IEditor): void {
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
                //else {
                //    this.commitAll(); ...you. And it is too small to provide it to settings
                //}
            }
        }

        notifyChanged(editor: Reinforced.Lattice.Editing.IEditor): void {
            this.retrieveEditorData(editor);
            for (var i = 0; i < this._activeEditors.length; i++) {
                this._activeEditors[i].notifyObjectChanged();
            }
        }

        public rejectAll(): void {
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.reject(this._activeEditors[i]);
            }
            this._isEditing = false;
            this.CurrentDataObjectModified = null;
            this.Cells = {};
            if (!this._isAddingNewRow) {
                var di = this.MasterTable.DataHolder.localLookupDisplayedDataObject(this.DataObject);
                if (di.IsCurrentlyDisplaying) {
                    //var row = this.MasterTable.Controller.produceRow(this.DataObject, di.DisplayedIndex);
                    this.MasterTable.Controller.redrawVisibleDataObject(this.DataObject);
                }
            } else {
                this.MasterTable.Renderer.Modifier.destroyRow(this);
            }

            //this.MasterTable.Renderer.Modifier.redrawRow(row);
        }

        reject(editor: Reinforced.Lattice.Editing.IEditor): void {
            this.CurrentDataObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
            this.setEditorValue(editor);
        }

        public add() {
            this.beginRowEdit(-1);
        }

        public beginRowEditHandle(e: IRowEventArgs) {
            //if (this._isEditing) return;
            this.beginRowEdit(e.Row);
        }

        public commitRowEditHandle(e: IRowEventArgs) {
            if (!this._isEditing) return;
            this.commitAll();
        }

        public rejectRowEditHandle(e: IRowEventArgs) {
            if (!this._isEditing) return;
            this.rejectAll();
        }

        public provide(rows: IRow[]): void {
            if (!this._isEditing) return;
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].DataObject['__key'] === this.DataObject['__key']) {
                    rows[i] = this;
                }
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            masterTable.Controller.registerAdditionalRowsProvider(this);
        }
    }
    ComponentsContainer.registerComponent('RowsEditHandler', RowsEditHandler);
}