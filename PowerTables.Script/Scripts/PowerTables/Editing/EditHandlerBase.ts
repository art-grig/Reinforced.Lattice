module PowerTables.Editing {
    export class EditHandlerBase<TConfiguration extends PowerTables.Editing.IEditFormUiConfigBase> extends PowerTables.Plugins.PluginBase<TConfiguration> implements IEditHandler {
        //#region IRow members
        public Cells: { [key: string]: ICell } = {};
        public DataObject: any;
        public IsSpecial: boolean = true;
        public Index: number;
        //#endregion

        protected CurrentDataObjectModified: any;
        protected ValidationMessages: IValidationMessage[] = [];
        protected EditorConfigurations: { [key: string]: IEditFieldUiConfigBase } = {};

        public commit(editor: PowerTables.Editing.IEditor): void {
            throw Error("Not implemented");
        }
        public notifyChanged(editor: PowerTables.Editing.IEditor): void {
            throw Error("Not implemented");
        }
        public reject(editor: PowerTables.Editing.IEditor): void {
            throw Error("Not implemented");
        }

        protected dispatchEditResponse(editResponse: PowerTables.ITableAdjustment, then: () => void) {
            if (then) then();
        }
        protected isEditable(column: IColumn): boolean {
            return this.EditorConfigurations.hasOwnProperty(column.RawName);
        }

        protected sendDataObjectToServer(then: () => void) {
            this.MasterTable.Loader.command('Edit', (r) => this.dispatchEditResponse(r, then), (q) => {
                q.AdditionalData['Edit'] = JSON.stringify(this.CurrentDataObjectModified);
                return q;
            });
        }

        protected hasChanges(): boolean {
            for (var k in this.DataObject) {
                if (this.DataObject[k] !== this.CurrentDataObjectModified[k]) return true;
            }
            return false;
        }

        protected setEditorValue(editor: PowerTables.Editing.IEditor) {
            editor.IsInitialValueSetting = true;
            editor.setValue(this.CurrentDataObjectModified[editor.FieldName]);
            editor.IsInitialValueSetting = false;
        }

        protected createEditor(fieldName: string, column: IColumn, canComplete: boolean, editorType: EditorMode): PowerTables.Editing.IEditor {
            var editorConf = this.EditorConfigurations[fieldName];
            var editor = ComponentsContainer.resolveComponent<PowerTables.Editing.IEditor>(editorConf.PluginId);
            editor.DataObject = this.DataObject;
            editor.ModifiedDataObject = this.CurrentDataObjectModified;
            editor.Data = this.DataObject[fieldName];
            editor.FieldName = fieldName;
            editor.Column = column;
            editor.CanComplete = canComplete;
            editor.IsFormEdit = editorType === EditorMode.Form;
            editor.IsRowEdit = editorType === EditorMode.Row;
            editor.IsCellEdit = !(editor.IsFormEdit || editor.IsRowEdit);
            editor.Row = this;
            editor.RawConfig = <any>{
                Configuration: editorConf,
                Order: 0,
                PluginId: editorConf.PluginId,
                Placement: '', TemplateId:
                editorConf.TemplateId
            }
            editor.init(this.MasterTable);
            return editor;
        }

        protected retrieveEditorData(editor: PowerTables.Editing.IEditor, errors?: IValidationMessage[]) {
            var errorsArrayPresent = (!(!errors));
            errors = errors || [];
            var thisErrors = [];
            this.CurrentDataObjectModified[editor.FieldName] = editor.getValue(thisErrors);
            for (var j = 0; j < thisErrors.length; j++) {
                thisErrors[j].Message = editor.getErrorMessage(thisErrors[j].Code);
            }
            editor.Data = this.CurrentDataObjectModified[editor.FieldName];
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

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            for (var i = 0; i < this.Configuration.Fields.length; i++) {
                this.EditorConfigurations[this.Configuration.Fields[i].FieldName] = this.Configuration.Fields[i];
            }
        }
    }

    export interface IEditHandler extends IRow {
        commit(editor: PowerTables.Editing.IEditor): void;
        notifyChanged(editor: PowerTables.Editing.IEditor): void;
        reject(editor: PowerTables.Editing.IEditor): void;
    }

    export enum EditorMode {
        Cell, Row, Form
    }
}