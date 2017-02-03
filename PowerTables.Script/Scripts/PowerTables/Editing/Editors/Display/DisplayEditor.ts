module PowerTables.Editing.Editors.Display {
    export class DisplayEditor extends PowerTables.Editing.EditorBase<PowerTables.Editing.Editors.Display.IDisplayingEditorUiConfig> {

        public ContentElement: HTMLElement;

        private _previousContent: string;

        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        public Render(): string {
            this._previousContent = this.Configuration.Template(this);
            return this._previousContent;
        }

        notifyObjectChanged(): void {
            var cont = this.Configuration.Template(this);
            if (cont !== this._previousContent) {
                this.ContentElement.innerHTML = cont;
                this._previousContent = cont;
            }
        }

        getValue(errors: PowerTables.Editing.IValidationMessage[]) {
            return this.DataObject[this.Column.RawName];
        }

        setValue(value): void { }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.Template == null || this.Configuration.Template == undefined) {
                this.Configuration.Template = (x) => {
                    return x.Data.toString();
                };
            }
        }
    }
    ComponentsContainer.registerComponent('DisplayEditor', DisplayEditor);
} 