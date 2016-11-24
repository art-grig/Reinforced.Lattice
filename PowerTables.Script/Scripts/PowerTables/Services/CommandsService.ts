module PowerTables.Services {
    export class CommandsService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._commandsCache = this._masterTable.InstanceManager.Configuration.Commands;
        }

        private _masterTable: IMasterTable;

        private _commandsCache: { [_: string]: PowerTables.Commands.ICommandDescription }

        public canExecute(commandName: string, subject: any = null): boolean {
            if (!this._commandsCache.hasOwnProperty(commandName)) return true;
            var command = this._commandsCache[commandName];
            if (command.CanExecute) {
                return command.CanExecute({ Subject: subject, Master: this._masterTable });
            }
            return true;
        }

        public triggerCommandOnRow(commandName: string, rowIndex: number, callback: ((params: ICommandExecutionParameters) => void) = null) {
            this.triggerCommand(commandName, this._masterTable.DataHolder.DisplayedData[rowIndex], callback);
        }

        public triggerCommand(commandName: string, subject: any, callback: ((params: ICommandExecutionParameters) => void) = null) {
            var command = this._commandsCache[commandName];
            if (command == null || command == undefined) {
                this.triggerCommandWithConfirmation(commandName, subject, null, callback);
                return;
            }

            if (command.CanExecute) {
                if (!command.CanExecute({ Subject: subject, Master: this._masterTable })) return;
            }

            if (command.Confirmation != null && command.Confirmation != undefined) {
                var tc = new ConfirmationWindowViewModel(this._masterTable, command, subject, callback);
                var r = this._masterTable.Renderer
                    .renderObject(command.Confirmation.TemplateId, tc, command.Confirmation.TargetSelector);
                tc.RootElement = r;
                tc.rendered();
            } else if (command.ConfirmationDataFunction != null && command.ConfirmationDataFunction != undefined) {
                var confirmationData = command.ConfirmationDataFunction({
                    CommandDescription: this._commandsCache[commandName],
                    Master: this._masterTable,
                    Selection: this._masterTable.Selection.getSelectedObjects(),
                    Subject: subject,
                    Result: null,
                    Confirmation: null
                });
                if (confirmationData != null) {
                    this.triggerCommandWithConfirmation(commandName, subject, confirmationData, callback);
                }
            } else {
                this.triggerCommandWithConfirmation(commandName, subject, null, callback);
            }
        }

        public triggerCommandWithConfirmation(commandName: string, subject: any, confirmation: any, callback: ((params: ICommandExecutionParameters) => void) = null) {
            var params = {
                CommandDescription: null,
                Master: this._masterTable,
                Selection: this._masterTable.Selection.getSelectedObjects(),
                Subject: subject,
                Result: null,
                Confirmation: confirmation
            };
            var cmd = this._commandsCache[commandName];
            if (!cmd) {
                this._masterTable.Loader.requestServer(commandName,
                    r => {
                        if (r.$isDeferred && r.$url) {
                            window.location.href = r.$url;
                            return;
                        }
                        params.Result = r;
                        if (callback) callback(params);
                    },
                    q => {
                        q.AdditionalData['CommandData'] = JSON.stringify({
                            Confirmation: confirmation,
                            Subject: subject
                        });
                        return q;
                    });

                return;
            }
            params.CommandDescription = cmd;
            if (cmd.CanExecute) {
                if (!cmd.CanExecute({ Subject: subject, Master: this._masterTable })) return;
            }

            if (cmd.Type === PowerTables.Commands.CommandType.Server) {

                this._masterTable.Loader.requestServer(commandName,
                    r => {
                        params.Result = r;
                        if (callback) callback(params);
                        if (cmd.OnSuccess) cmd.OnSuccess(params);
                    },
                    q => {
                        q.AdditionalData['CommandData'] = JSON.stringify({
                            Confirmation: confirmation,
                            Subject: subject
                        });
                        return q;
                    },
                    r => {
                        params.Result = r;
                        if (callback) callback(params);
                        if (cmd.OnFailure) cmd.OnFailure(params);
                    });
            } else {
                cmd.ClientFunction(params);
            }
        }
    }

    export class ConfirmationWindowViewModel implements PowerTables.Editing.IEditHandler {
        constructor(masterTable: IMasterTable, commandDescription: PowerTables.Commands.ICommandDescription, subject: any, originalCallback: ((params: ICommandExecutionParameters) => void)) {
            this._masterTable = masterTable;
            this._commandDescription = commandDescription;
            this._config = commandDescription.Confirmation;
            this._originalCallback = originalCallback;
            this.DataObject = {};
            this._editorObjectModified = {};
            this.Subject = subject;
            this.Selection = this._masterTable.Selection.getSelectedObjects();

            this._embedBound = this.embedConfirmation.bind(this);

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

            var tplParams: ICommandExecutionParameters = {
                CommandDescription: this._commandDescription,
                Master: this._masterTable,
                Confirmation: this._editorObjectModified,
                Result: null,
                Selection: this.Selection,
                Subject: subject
            };

            var templatePieces = this._config.TemplatePieces;
            for (var k in templatePieces) {
                if (templatePieces.hasOwnProperty(k)) {
                    this.TemplatePieces[k] = templatePieces[k](tplParams);
                }
            }
        }


        public RootElement: HTMLElement = null;
        public ContentPlaceholder: HTMLElement = null;
        public DetailsPlaceholder: HTMLElement = null;
        public TemplatePieces: { [_: string]: string } = {};

        public VisualStates: PowerTables.Rendering.VisualState;
        public Subject: any;
        public Selection: any[];

        public RecentDetails: { Data: any } = { Data: null };

        private _masterTable: IMasterTable;
        private _commandDescription: PowerTables.Commands.ICommandDescription;
        private _config: PowerTables.Commands.IConfirmationConfiguration;
        private _embedBound: any;

        private _editorObjectModified: any;
        private _editorColumn: { [_: string]: IColumn } = {};
        private _originalCallback: ((params: ICommandExecutionParameters) => void) = null;

        public rendered() {
            this.initFormWatchDatepickers(this.RootElement);
            this.loadContent();
            if (this._config.Details != null && this._config.Details != undefined) {
                if (this._config.Details.LoadImmediately) this.loadDetailsInternal();
            }
        }

        //#region Content loading
        private loadContent() {
            if (this.ContentPlaceholder == null) return;
            if ((!this._config.ContentLoadingUrl) && (!this._config.ContentLoadingCommand)) return;
            if (this.VisualStates != null) this.VisualStates.mixinState('contentLoading');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.mixinState('loading');
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
                }, this._embedBound, r => {
                    this.ContentPlaceholder.innerHTML = r;
                    this.contentLoaded();
                });
            }
        }

        private contentLoaded() {
            if (this.VisualStates != null) this.VisualStates.unmixinState('contentLoading');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.unmixinState('loading');
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
        //#endregion

        //#region Details loading
        private _loadDetailsTimeout: any = null;

        private loadDetails() {
            if (this.DetailsPlaceholder == null) return;
            if (this._config.Details == null || this._config.Details == undefined) return;
            if (this._config.Details.LoadDelay <= 0) {
                this.loadDetailsInternal();
            } else {
                clearTimeout(this._loadDetailsTimeout);
                this._loadDetailsTimeout = setTimeout(() => {
                    this.loadDetailsInternal();
                }, this._config.Details.LoadDelay);
            }
        }

        private loadDetailsInternal() {
            var parameters = this.collectCommandParameters();
            if (this._config.Details.ValidateToLoad != null) {
                if (!this._config.Details.ValidateToLoad(parameters)) return;
            }

            if (this.VisualStates != null) this.VisualStates.mixinState('detailsLoading');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhileDetailsLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.mixinState('loading');
                }
            }


            if (this._config.Details.CommandName != null && this._config.Details.CommandName != undefined) {
                this._masterTable.Loader.requestServer(this._config.Details.CommandName,
                    r => {
                        this.detailsLoaded(r);
                    },
                    this._embedBound,
                    r => {
                        this.detailsLoaded(r);
                    });
            } else if (this._config.Details.DetailsFunction != null && this._config.Details.DetailsFunction != undefined) {
                this.detailsLoaded(this._config.Details.DetailsFunction(parameters));
            } else {
                this.detailsLoaded(this.getConfirmation());
            }

        }

        private detailsLoaded(detailsResult: any) {
            if (detailsResult != null && detailsResult != undefined) {
                if (typeof detailsResult == 'string') {
                    this.DetailsPlaceholder.innerHTML = detailsResult;
                    this.initFormWatchDatepickers(this.DetailsPlaceholder);
                } else {
                    if (this._config.Details.TempalteId != null && this._config.Details.TempalteId != undefined) {
                        var param = {
                            Subject: this.Subject,
                            Details: detailsResult,
                            Confirmation: this.getConfirmation()
                        };
                        this._masterTable.Renderer
                            .renderObjectTo(this._config.Details.TempalteId, param, this.DetailsPlaceholder);
                        this.initFormWatchDatepickers(this.DetailsPlaceholder);
                    } else {
                        this.DetailsPlaceholder.innerHTML = detailsResult.toString();
                        this.initFormWatchDatepickers(this.DetailsPlaceholder);
                    }
                }

            }

            this.RecentDetails.Data = detailsResult;

            if (this.VisualStates != null) this.VisualStates.unmixinState('detailsLoading');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhileDetailsLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.unmixinState('loading');
                }
            }
        }

        //#endregion


        private embedConfirmation(q: IQuery): IQuery {
            q.AdditionalData['CommandData'] = JSON.stringify({
                Confirmation: this.getConfirmation(),
                Subject: this.Subject
            });
            return q;
        }

        private collectCommandParameters(): ICommandExecutionParameters {
            var result: ICommandExecutionParameters = {
                CommandDescription: this._commandDescription,
                Master: this._masterTable,
                Selection: this.Selection,
                Subject: this.Subject,
                Result: null,
                Confirmation: this.getConfirmation()
            };


            return result;
        }

        private getConfirmation() {
            var confirmation = null;
            if (this._config.Formwatch != null) {
                confirmation = PowerTables.Plugins.Formwatch.FormwatchPlugin.extractFormData(this._config.Formwatch, this.RootElement, this._masterTable.Date);
            }

            if (this._config.Autoform != null) {
                this.collectAutoForm();
                if (confirmation == null) confirmation = {};
                let confirmationObject = this._editorObjectModified;
                for (var eo in confirmationObject) {
                    if (confirmationObject.hasOwnProperty(eo)) {
                        confirmation[eo] = confirmationObject[eo];
                    }
                }
            }
            return confirmation;
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
            if (this.VisualStates != null) this.VisualStates.mixinState('saving');
            if (this._config.Autoform != null && this._config.Autoform.DisableWhenContentLoading) {
                for (var i = 0; i < this.ActiveEditors.length; i++) {
                    if (this.ActiveEditors[i].VisualStates != null) this.ActiveEditors[i].VisualStates.mixinState('saving');
                }
            }
            if (this._config.OnCommit) this._config.OnCommit(this.collectCommandParameters());
            this._masterTable.Commands.triggerCommandWithConfirmation(this._commandDescription.Name,
                this.Subject, this.getConfirmation(), r => {
                    var params = this.collectCommandParameters();
                    params.Result = r;
                    this.RootElement = null;
                    this.ContentPlaceholder = null;
                    this.DetailsPlaceholder = null;
                    this.MasterTable.Renderer.destroyObject(this._commandDescription.Confirmation.TargetSelector);
                    if (this._originalCallback) this._originalCallback(params);
                });
        }

        public dismiss() {
            this.RootElement = null;
            this.ContentPlaceholder = null;
            this.DetailsPlaceholder = null;
            this.MasterTable.Renderer.destroyObject(this._commandDescription.Confirmation.TargetSelector);
            if (this._config.OnDismiss) this._config.OnDismiss(this.collectCommandParameters());
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
            var editorConf = this._commandDescription.Confirmation.Autoform.Autoform[fieldName];
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
            for (var j = 0; j < fields.length; j++) {
                this._editorColumn[fields[j].FieldName] = PowerTables.Services.InstanceManagerService.createColumn(fields[j].FakeColumn, this._masterTable);
                this.DataObject[fields[j].FieldName] = this
                    .defaultValue(this._editorColumn[fields[j].FieldName]);
                this._editorObjectModified[fields[j].FieldName] = this.DataObject[fields[j].FieldName];
            }

        }
        private initAutoform(autoform: PowerTables.Commands.ICommandAutoformConfiguration) {
            var fields = autoform.Autoform;
            for (var i = 0; i < fields.length; i++) {
                var editorConf = fields[i];
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
            this.loadDetails();
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

        private collectAutoForm(): boolean {
            this.ValidationMessages = [];
            var errors = [];
            for (var i = 0; i < this.ActiveEditors.length; i++) {
                this.retrieveEditorData(this.ActiveEditors[i], errors);
            }
            this.ValidationMessages = errors; //todo draw validation errors

            if (this.ValidationMessages.length > 0) {
                this.MasterTable.Events.EditValidationFailed.invokeAfter(this,
                    <any>{
                        OriginalDataObject: this.DataObject,
                        ModifiedDataObject: this._editorObjectModified,
                        Messages: this.ValidationMessages
                    });
                return false;
            }
            return true;
        }


        //#endregion


    }
} 