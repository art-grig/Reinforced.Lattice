module PowerTables.Editing.Form {
    export class FormEditHandler extends PowerTables.Editing.EditHandlerBase<PowerTables.Editing.Form.IFormEditUiConfig> {
        private _currentForm: FormEditFormModel;
        private _currentFormElement: HTMLElement;

        private _activeEditors: IEditor[] = [];
        private _isEditing: boolean;

        private ensureEditing(rowDisplayIndex: number) {
            if (this._isEditing) return;
            var lookup = this.MasterTable.DataHolder.StoredCache[rowDisplayIndex];
            this.ensureEditingObject(lookup);
        }

        private ensureEditingObject(dataObject:any) {
           
            this.DataObject = dataObject;
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
            this.DataObject = this.MasterTable.DataHolder.defaultObject();
            this.CurrentDataObjectModified = this.MasterTable.DataHolder.defaultObject();
            for (var i = 0; i < this.Configuration.Fields.length; i++) {
                if (this.Configuration.Fields[i].PluginId !== 'DisplayEditor') {
                    this.DataObject[this.Configuration.Fields[i].FieldName] = null;
                    this.CurrentDataObjectModified[this.Configuration.Fields[i].FieldName] = null;
                }
            }
            this.startupForm();

        }

        public beginEdit(dataObject:any) {
            if (this._isEditing) {
                this.rejectAll();
            }
            this.ensureEditing(dataObject);
            this.startupForm();
        }

        public beginFormEditHandler(e: IRowEventArgs) {
            if (this._isEditing) {
                var lookup = this.MasterTable.DataHolder.StoredCache[e.Row];
                if (this.DataObject !== lookup) {
                    this.rejectAll();
                }
            }
            this.ensureEditing(e.Row);
            this.startupForm();
        }

        private startupForm() {
            this.MasterTable.Events.Edit.invokeBefore(this, this.CurrentDataObjectModified);
            var vm: FormEditFormModel = new FormEditFormModel();
            for (var i = 0; i < this.Configuration.Fields.length; i++) {
                var editorConf = this.Configuration.Fields[i];
                var column = null;
                if (editorConf.FakeColumn != null) {
                    column = PowerTables.Services.InstanceManagerService.createColumn(editorConf.FakeColumn, this.MasterTable);
                } else {
                    column = this.MasterTable.InstanceManager.Columns[editorConf.FieldName];
                }
                var editor = this.createEditor(editorConf.FieldName, column, false, EditorMode.Form);
                this._activeEditors.push(editor);
                vm.EditorsSet[editorConf.FieldName] = editor;
                vm.ActiveEditors.push(editor);
            }
            vm.DataObject = this.DataObject;
            vm.Handler = this;
            this._currentForm = vm;
            this._currentFormElement = this.MasterTable.Renderer.renderObject(this.Configuration.FormTemplateId, vm, this.Configuration.FormTargetSelector);
            vm.RootElement = this._currentFormElement;
            this.stripNotRenderedEditors();
            for (var j = 0; j < this._activeEditors.length; j++) {
                this.setEditorValue(this._activeEditors[j]);
            }
        }

        private stripNotRenderedEditors() {
            var newEditors = [];
            for (var i = 0; i < this._activeEditors.length; i++) {
                if (this._activeEditors[i]["_IsRendered"]) newEditors.push(this._activeEditors[i]);
            }
            if (newEditors.length === this._activeEditors.length) return;
            this._activeEditors = newEditors;
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
                    this.MasterTable.Renderer.Modifier.cleanSelector(this.Configuration.FormTargetSelector);
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
            this.MasterTable.Renderer.Modifier.cleanSelector(this.Configuration.FormTargetSelector);
            this._currentFormElement = null;
            this._currentForm = null;
        }

        notifyChanged(editor: PowerTables.Editing.IEditor): void {
            this.retrieveEditorData(editor);
            for (var i = 0; i < this._activeEditors.length; i++) {
                this._activeEditors[i].notifyObjectChanged();
            }
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
                //else {
                //    this.commitAll(); not sure that majority of users will value such kind of solution
                //}
            }
        }

        reject(editor: PowerTables.Editing.IEditor): void {
            this.CurrentDataObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
            this.setEditorValue(editor);
        }

    }

    export class FormEditFormModel {
        public EditorsSet: { [key: string]: IEditor } = {};
        public  ActiveEditors: IEditor[] = [];

        public Handler: FormEditHandler;
        public RootElement: HTMLElement;
        public DataObject: any;

        public Editors(p:PowerTables.Templating.TemplateProcess): void {
            for (var i = 0; i < this.ActiveEditors.length; i++) {
                this.editor(p,this.ActiveEditors[i]);
            }
        }

        private editor(p: PowerTables.Templating.TemplateProcess,editor: IEditor): void {
            editor['_IsRendered'] = true;
            editor.renderContent(p);
        }

        public Editor(p: PowerTables.Templating.TemplateProcess,fieldName: string): void {
            var editor = this.EditorsSet[fieldName];
            this.editor(p,editor);
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