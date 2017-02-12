module Reinforced.Lattice.Editing.Editors.Check {
    
    export class CheckEditor extends Reinforced.Lattice.Editing.EditorBase<Reinforced.Lattice.Editing.Editors.Check.ICheckEditorUiConfig> {
        FocusElement:HTMLElement;
        private _value: boolean;

        public renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        public changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void {
            this._value = !this._value;
            this.updateState();
            super.changedHandler(e);
        }

        private updateState() {
            if (!this._value) {
                this.VisualStates.unmixinState('checked');
            } else {
                this.VisualStates.mixinState('checked');
            }
        }

        public getValue(errors: Reinforced.Lattice.Editing.IValidationMessage[]): any {
            if (this.Configuration.IsMandatory && !this._value) {
                errors.push({ Code: 'MANDATORY' });
                return null;
            }
            return this._value;
        }

        public setValue(value: any): void {
            this._value = (!(!value));
            if (!this.VisualStates) return;
            this.updateState();
        }

        public focus(): void {
            if (this.FocusElement) this.FocusElement.focus();
        }

        defineMessages(): { [key: string]: string } {
            return {
                'MANDATORY': `${this.Column.Configuration.Title} is required`
            }
        }
    }

    ComponentsContainer.registerComponent('CheckEditor', CheckEditor);
} 