module PowerTables.Editing.Editors.Display {
    export class DisplayEditor extends PowerTables.Editing.EditorBase<PowerTables.Editing.Editors.Display.IDisplayingEditorUiConfig> {

        public ContentElement: HTMLElement;

        private _previousContent: string;

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
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

        setValue(value): void {}
    }
    ComponentsContainer.registerComponent('DisplayEditor', DisplayEditor);
} 