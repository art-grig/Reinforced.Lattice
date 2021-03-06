﻿module Reinforced.Lattice.Editing.Editors.Display {
    export class DisplayEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.Display.IDisplayingEditorUiConfig> {

        public ContentElement: HTMLElement;

        private _previousContent: string;

        public renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        public Render(p:Reinforced.Lattice.Templating.TemplateProcess): void {
            this._previousContent = this.Configuration.Template(this);
            p.w(this._previousContent);
        }

        notifyObjectChanged(): void {
            var cont = this.Configuration.Template(this);
            if (cont !== this._previousContent) {
                this.ContentElement.innerHTML = cont;
                this._previousContent = cont;
            }
        }

        getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]) {
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