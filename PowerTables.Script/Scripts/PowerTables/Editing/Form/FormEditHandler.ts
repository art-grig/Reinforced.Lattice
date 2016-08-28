module PowerTables.Editing.Form {
    export class FormEditHandler extends PowerTables.Editing.EditHandlerBase<PowerTables.Editing.Form.IFormEditUiConfig> {
        private _currentForm: FormEditFormModel;
        private _currentFormElement: HTMLElement;

        private _activeEditors: IEditor[] = [];
        private _isEditing: boolean;

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
            this._isEditing = true;
        }

        public add() {
            if (this._isEditing) {
                this.rejectAll();
            }
            this.DataObject = {};
            this.CurrentDataObjectModified = {};
            this.startupForm();

        }

        public beginFormEditHandler(e: IRowEventArgs) {
            if (this._isEditing) {
                var lookup = this.MasterTable.DataHolder.localLookupDisplayedData(e.DisplayingRowIndex);
                if (this.DataObject !== lookup.DataObject) {
                    this.rejectAll();
                }
            }
            this.ensureEditing(e.DisplayingRowIndex);
            this.startupForm();
        }

        private startupForm() {
            var vm: FormEditFormModel = new FormEditFormModel();
            for (var i = 0; i < this.Configuration.Fields.length; i++) {
                var editorConf = this.Configuration.Fields[i];
                var editor = this.createEditor(editorConf.FieldName, this.MasterTable.InstanceManager.Columns[editorConf.FieldName], false, EditorMode.Form);
                this._activeEditors.push(editor);
                vm.EditorsSet[editorConf.FieldName] = editor;
            }
            vm.DataObject = this.DataObject;
            vm.Handler = this;
            this._currentForm = vm;
            this._currentFormElement = this.MasterTable.Renderer.renderObject(this.Configuration.FormTemplateId, vm, this.Configuration.FormTargetSelector);
            vm.RootElement = this._currentFormElement;
            for (var j = 0; j < this._activeEditors.length; j++) {
                this.setEditorValue(this._activeEditors[j]);
            }
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
                if (!this._isEditing) {
                    this.CurrentDataObjectModified = null;
                    this.MasterTable.Renderer.destroyObject(this.Configuration.FormTargetSelector);
                    this._currentFormElement = null;
                    this._currentForm = null;
                }
            });
        }

        public rejectAll(): void {
            for (var i = 0; i < this._activeEditors.length; i++) {
                this.reject(this._activeEditors[i]);
            }
            this._isEditing = false;
            this.CurrentDataObjectModified = null;
            this.MasterTable.Renderer.destroyObject(this.Configuration.FormTargetSelector);
            this._currentFormElement = null;
            this._currentForm = null;
        }

        notifyChanged(editor: PowerTables.Editing.IEditor): void {
            this.retrieveEditorData(editor);
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

        reject(editor: PowerTables.Editing.IEditor): void {
            this.CurrentDataObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
            this.setEditorValue(editor);
        }
    }

    export class FormEditFormModel {
        public EditorsSet: { [key: string]: IEditor } = {};
        public Handler: FormEditHandler;
        public RootElement: HTMLElement;
        public DataObject: any;
        
        public Editors(): string {
            var s = '';
            for (var k in this.EditorsSet) {
                s += this.Editor(this.EditorsSet[k].FieldName);
            }
            return s;
        }

        public Editor(fieldName: string): string {
            var editor = this.EditorsSet[fieldName];
            return this.Handler.MasterTable.Renderer.renderObjectContent(editor);
        }

        public commit() {
            this.Handler.commitAll();
        }

        public reject() {
            this.Handler.rejectAll();
        }

    }
    ComponentsContainer.registerComponent('FormEditHandler', FormEditHandler);
} 