module PowerTables.Services {


    export class CommandsService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._commandsCache = this._masterTable.InstanceManager.Configuration.Commands;
        }

        private _masterTable: IMasterTable;

        private _commandsCache: { [_: string]: PowerTables.Commands.ICommandDescription }


        public triggerCommand(commandName: string, subject: any, callback: ((params: ICommandExecutionParameters) => void) = null) {
            var command = this._commandsCache[commandName];
            if (command == null || command == undefined) {
                throw Error(`Command ${commandName} was not found`);
            }

            if (command.Confirmation != null && command.Confirmation != undefined) {
                var tc = new ConfirmationWindowViewModel(this._masterTable, command, subject);
                var r = this._masterTable.Renderer
                    .renderObject(command.Confirmation.TemplateId, tc, command.Confirmation.TargetSelector);
                tc.RootElement = r;
                tc.rendered();
            } else {
                this.triggerCommandWithConfirmation(commandName, subject, null, callback);
            }
        }

        public triggerCommandWithConfirmation(commandName: string, subject: any, confirmation: any, callback: ((params: ICommandExecutionParameters) => void) = null) {

        }
    }

    export class ConfirmationWindowViewModel implements PowerTables.Editing.IEditHandler {
        constructor(masterTable: IMasterTable, commandDescription: PowerTables.Commands.ICommandDescription, subject: any) {
            this._masterTable = masterTable;
            this._commandDescription = commandDescription;
            this._config = commandDescription.Confirmation;

            this.DataObject = {};
            this._editorObjectModified = {};
            this.Subject = subject;

            if (commandDescription.Confirmation.Autoform != null) {
                this.produceAutoformColumns(commandDescription.Confirmation.Autoform);
            }

            if (commandDescription.Confirmation.InitConfirmationObject) {
                commandDescription.Confirmation.InitConfirmationObject(this.DataObject);
                let confirmationObject = this.DataObject;
                for (var eo in confirmationObject) {
                    if (confirmationObject.hasOwnProperty(eo)) {
                        this._editorObjectModified[eo] = confirmationObject[eo];
                    }
                }
            }

            if (commandDescription.Confirmation.Autoform != null) {
                this.initAutoform(commandDescription.Confirmation.Autoform);
            }
        }


        public RootElement: HTMLElement = null;
        public ContentPlaceholder: HTMLElement = null;
        public DetailsPlaceholder: HTMLElement = null;

        public VisualStates: PowerTables.Rendering.VisualState;
        public Subject: any;

        private _masterTable: IMasterTable;
        private _commandDescription: PowerTables.Commands.ICommandDescription;
        private _config: PowerTables.Commands.IConfirmationConfiguration;

        private _editorObjectModified: any;
        private _editorColumn: { [_: string]: IColumn } = {};

        public rendered() {
            this.initFormWatchDatepickers(this.RootElement);
            this.loadContent();
        }

        private loadContent() {
            if (this.ContentPlaceholder == null) return;
            if ((!this._config.ContentLoadingUrl) && (!this._config.ContentLoadingCommand)) return;
            if (this.VisualStates != null) this.VisualStates.mixinState('contentLoading');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.mixinState('saving');
                }
            }
            if (this._config.ContentLoadingUrl != null && this._config.ContentLoadingUrl != undefined) {
                var url = this._config.ContentLoadingUrl(this.Subject);
                this.loadContentByUrl(url, this._config.ContentLoadingMethod);
            } else {
                this._masterTable.Loader.requestServer(this._config.ContentLoadingCommand, r => {
                    this.ContentPlaceholder.innerHTML = r;
                    this.initFormWatchDatepickers(this.ContentPlaceholder);
                    this.contentLoaded();
                }, null, r => {
                    this.ContentPlaceholder.innerHTML = r;
                    this.contentLoaded();
                });
            }
        }

        private contentLoaded() {
            if (this.VisualStates != null) this.VisualStates.unmixinState('contentLoading');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.unmixinState('saving');
                }
            }
        }

        private loadContentByUrl(url: string, method: string) {
            var req = this._masterTable.Loader.createXmlHttp();
            req.open(method, url, true);
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            var reqEvent: string = req.onload ? 'onload' : 'onreadystatechange';
            req[reqEvent] = (() => {
                if (req.readyState !== 4) return false;
                this.ContentPlaceholder.innerHTML = req.responseText;
                this.contentLoaded();
            });
            if (method === 'GET' || this.Subject === null) req.send();
            else req.send(JSON.stringify(this.Subject));
        }

        private loadDetails() {
            if (this.DetailsPlaceholder == null) return;
            if (this._config.Details == null || this._config.Details == undefined) return;

        }

        private initFormWatchDatepickers(parent: HTMLElement) {
            var formWatch = this._commandDescription.Confirmation.Formwatch;

            if (formWatch != null) {
                for (var i = 0; i < formWatch.length; i++) {
                    var conf = formWatch[i];
                    if (conf.TriggerSearchOnEvents && conf.TriggerSearchOnEvents.length > 0) {
                        var element = <HTMLInputElement>parent.querySelector(conf.FieldSelector);
                        if (conf.AutomaticallyAttachDatepicker) {
                            this._masterTable.Date.createDatePicker(element);
                        }
                    }
                }
            }
        }

        public confirm() {

        }

        public dismiss() {

        }

        //#region Autoform
        public EditorsSet: { [key: string]: PowerTables.Editing.IEditor } = {};
        public ActiveEditors: PowerTables.Editing.IEditor[] = [];

        public Editors(): string {
            var s = '';
            for (var i = 0; i < this.ActiveEditors.length; i++) {
                s += this.editor(this.ActiveEditors[i]);
            }
            return s;
        }

        private editor(editor: PowerTables.Editing.IEditor): string {
            return this._masterTable.Renderer.renderObjectContent(editor);
        }

        public Editor(fieldName: string): string {
            var editor = this.EditorsSet[fieldName];
            if (editor == null || editor == undefined) return '';
            return this.editor(editor);
        }

        private createEditor(fieldName: string, column: IColumn): PowerTables.Editing.IEditor {
            var editorConf = this._commandDescription.Confirmation.Autoform.Autoform.Fields[fieldName];
            var editor = ComponentsContainer.resolveComponent<PowerTables.Editing.IEditor>(editorConf.PluginId);
            editor.DataObject = this.DataObject;
            editor.ModifiedDataObject = this._editorObjectModified;
            editor.Data = this.DataObject[fieldName];
            editor.FieldName = fieldName;
            editor.Column = column;
            editor.CanComplete = false;
            editor.IsFormEdit = true;
            editor.IsRowEdit = false;
            editor.IsCellEdit = !(editor.IsFormEdit || editor.IsRowEdit);
            editor.Row = this;
            editor.RawConfig = { Configuration: editorConf, Order: 0, PluginId: editorConf.PluginId, Placement: '', TemplateId: editorConf.TemplateId }
            editor.init(this._masterTable);
            return editor;
        }

        public defaultValue(col: IColumn): any {
            if (col.IsInteger || col.IsFloat) return 0;
            if (col.IsBoolean) return false;
            if (col.IsDateTime) return new Date();
            if (col.IsString) return '';
            if (col.IsEnum) return 0;
            if (col.Configuration.IsNullable) return null;
            return null;
        }

        private produceAutoformColumns(autoform: PowerTables.Commands.ICommandAutoformConfiguration) {
            var fields = autoform.Autoform;
            for (var j = 0; j < fields.Fields.length; j++) {
                this._editorColumn[fields.Fields[j].FieldName] = PowerTables.Services.InstanceManagerService.createColumn(fields.Fields[j].FakeColumn, this._masterTable);
                this.DataObject[fields.Fields[j].FieldName] = this
                    .defaultValue(this._editorColumn[fields.Fields[j].FieldName]);
                this._editorObjectModified[fields.Fields[j].FieldName] = this.DataObject[fields.Fields[j].FieldName];
            }

        }
        private initAutoform(autoform: PowerTables.Commands.ICommandAutoformConfiguration) {
            var fields = autoform.Autoform;
            for (var i = 0; i < fields.Fields.length; i++) {
                var editorConf = fields.Fields[i];
                var column = this._editorColumn[editorConf.FieldName];

                var editor = this.createEditor(editorConf.FieldName, column);
                this.EditorsSet[editorConf.FieldName] = editor;
                this.ActiveEditors.push(editor);
            }
        }

        DataObject: any;
        Index: number;
        MasterTable: IMasterTable;
        Cells: { [index: string]: ICell; };
        ValidationMessages: PowerTables.Editing.IValidationMessage[] = [];

        notifyChanged(editor: PowerTables.Editing.IEditor): void {
            this.retrieveEditorData(editor);
            for (var i = 0; i < this.ActiveEditors.length; i++) {
                this.ActiveEditors[i].notifyObjectChanged();
            }
        }
        reject(editor: PowerTables.Editing.IEditor): void {
            this._editorObjectModified[editor.FieldName] = this.DataObject[editor.FieldName];
            this.setEditorValue(editor);
        }
        commit(editor: PowerTables.Editing.IEditor): void {
            var idx = this.ActiveEditors.indexOf(editor);
            if (this.ActiveEditors.length > idx + 1) {
                idx = -1;
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (!this.ActiveEditors[i].IsValid) {
                        idx = i;
                        break;
                    }
                }
                if (idx !== -1) this.ActiveEditors[idx].focus();
                //else {
                //    this.commitAll(); not sure that majority of users will value such kind of solution
                //}
            }
        }
        private retrieveEditorData(editor: PowerTables.Editing.IEditor, errors?: PowerTables.Editing.IValidationMessage[]) {
            var errorsArrayPresent = (!(!errors));
            errors = errors || [];
            var thisErrors = [];
            this._editorObjectModified[editor.FieldName] = editor.getValue(thisErrors);
            for (var j = 0; j < thisErrors.length; j++) {
                thisErrors[j].Message = editor.getErrorMessage(thisErrors[j].Code);
            }
            editor.Data = this._editorObjectModified[editor.FieldName];
            editor.ValidationMessages = thisErrors;
            for (var i = 0; i < thisErrors.length; i++) {
                errors.push(thisErrors[i]);
            }

            if (thisErrors.length > 0) {
                editor.IsValid = false;
                if (editor.VisualStates != null) editor.VisualStates.changeState('invalid');
            } else {
                editor.IsValid = true;
                if (editor.VisualStates != null) editor.VisualStates.normalState();
            }

            if (!errorsArrayPresent) {
                this.ValidationMessages.concat(errors);
            }
        }

        protected setEditorValue(editor: PowerTables.Editing.IEditor) {
            editor.IsInitialValueSetting = true;
            editor.setValue(this._editorObjectModified[editor.FieldName]);
            editor.IsInitialValueSetting = false;
        }
        //#endregion


    }
} 