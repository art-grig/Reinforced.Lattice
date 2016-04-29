module PowerTables.Plugins.Editors {
    import CheckEditorUiConfig = PowerTables.Editors.Check.ICheckEditorUiConfig;

    export class CheckEditor extends CellEditorBase<CheckEditorUiConfig> {
        FocusElement:HTMLElement;
        private _value: boolean;

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
        }

        public changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void {
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

        public getValue(errors: PowerTables.Plugins.IValidationMessage[]): any {
            if (this.Configuration.IsMandatory && !this._value) {
                errors.push({ Code: 'MANDATORY', Message: `${this.Column.Configuration.Title} is required` });
                return null;
            }
            return this._value;
        }

        public setValue(value: any): void {
            this._value = (!(!value));
            this.updateState();
        }

        public focus(): void {
            if (this.FocusElement) this.FocusElement.focus();
        }
    }

    ComponentsContainer.registerComponent('CheckEditor', CheckEditor);
} 