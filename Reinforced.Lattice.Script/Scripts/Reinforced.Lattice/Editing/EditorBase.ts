module Reinforced.Lattice.Editing {
    export class EditorBase<T extends Reinforced.Lattice.Editing.IEditFieldUiConfigBase> extends Reinforced.Lattice.Plugins.PluginBase<T> implements Reinforced.Lattice.Editing.IEditor {

        /**
         * Is current editor valid (flag set by master editor)
         */
        public IsValid: boolean;

        /**
         * True when field is single, false when multiple (e.g. row edit, form edit)
         */
        public CanComplete: boolean;

        /**
         * True when cell editor is part of row edit, otherwise false
         */
        public IsRowEdit: boolean;

        /**
         * True when cell editor is part of form edit, otherwise false
         */
        public IsFormEdit: boolean;

        /**
        * True when cell editor is editing cell
        */
        public IsCellEdit: boolean;

        /**
         * Original, locally displayed data object
         */
        public DataObject: any;

        /**
         * Value for particular editor column
         */
        public Data: any;

        /**
         * Collection with editor's recent validation messages
         */
        public ValidationMessages: IValidationMessage[] = [];

        public renderedValidationMessages(): string {
            return this.MasterTable.Renderer.renderToString((<any>this.Configuration).ValidationMessagesTemplateId,
                {
                    Messages: this.ValidationMessages,
                    IsRowEdit: this.IsRowEdit,
                    IsFormEdit: this.IsFormEdit
                });
        }

        /**
         * Retrieves original value for this particular cell editor
         * 
         * @returns {Any} Original, unchanged value
         */
        protected getThisOriginalValue(): any {
            return this.DataObject[this.Column.RawName];
        }

        /**
         * Resets editor value to initial settings
         */
        public reset(): void {
            this.setValue(this.getThisOriginalValue());
        }

        /**
         * Data object that is modified within editing process
         */
        public ModifiedDataObject: any;

        /**
         * Reference to parent editor
         */
        public Row: IEditHandler;

        /**
         * Corresponding column
         */
        public Column: IColumn;

        /**
         * Flag when initial value setting occures
         */
        public IsInitialValueSetting: boolean;

        /**
         * Returns entered editor value
         * 
         * @returns {} 
         */
        public getValue(errors: IValidationMessage[]): any { throw new Error("Not implemented"); }

        /**
         * Sets editor value from the outside
         */
        public setValue(value: any): void { throw new Error("Not implemented"); }

        /**
         * Template-bound event raising on changing this editor's value 
         */
        public changedHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void {
            if (this.IsInitialValueSetting) return;
            this.Row.notifyChanged(this);
        }

        /**
         * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
         * Commit leads to validation. Cell editor should be notified
         */
        public commitHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void {
            this.Row.commit(this);
        }

        /**
         * Event handler for reject (cancel editing) event raised from inside of CellEditor
         * Cell editor should be notified
         */
        public rejectHandler(e: Reinforced.Lattice.ITemplateBoundEvent): void {
            this.Row.reject(this);
        }

        /**
         * Called when cell editor has been drawn
         * 
         * @param e HTML element where editor is rendered
         * @returns {} 
         */
        public onAfterRender(e: HTMLElement): void { }

        /**
         * Needed by editor in some cases
         * 
         * @returns {} 
         */
        public focus(): void { }

        public OriginalContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            Reinforced.Lattice.Templating.Driver.cellContent(this, p);
        }

        FieldName: string;

        notifyObjectChanged(): void { }

        private _errorMessages: { [key: string]: string };

        protected defineMessages(): { [key: string]: string } {
            return {};
        }

        public getErrorMessage(key: string): string {
            if (!this._errorMessages.hasOwnProperty(key)) return 'Error';
            return this._errorMessages[key];
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._errorMessages = this.defineMessages();
            for (var k in this.Configuration.ValidationMessagesOverride) {
                this._errorMessages[k] = this.Configuration.ValidationMessagesOverride[k];
            }
        }
    }

    export interface IEditor extends IPlugin, ICell {
        /**
         * Plugin's visual states collection. 
         * Usually it is not used, but always it is better to have one 
         */
        VisualStates: Reinforced.Lattice.Rendering.VisualState;

        /**
         * Original, locally displayed data object
         */
        DataObject: any;

        /**
         * Data object that is modified within editing process
         */
        ModifiedDataObject: any;

        /**
         * Returns entered editor value
         * 
         * @param errors Validation errors collection
         * @returns {} 
         */
        getValue(errors: IValidationMessage[]): any;

        /**
         * Sets editor value from the outside
         */
        setValue(value: any): void;

        /**
         * Corresponding column
         */
        Column: IColumn;

        FieldName: string;

        /**
         * Resets editor value to initial settings
         */
        reset(): void;

        /**
         * True when field is single, false when multiple (e.g. row edit, form edit)
         */
        CanComplete: boolean;

        /**
         * True when cell editor is part of row edit, otherwise false
         */
        IsRowEdit: boolean;

        /**
         * True when cell editor is part of form edit, otherwise false
         */
        IsFormEdit: boolean;

        /**
        * True when cell editor is editing cell
        */
        IsCellEdit: boolean;

        /**
         * Flag when initial value setting occures
         */
        IsInitialValueSetting: boolean;

        /**
        * Called when cell editor has been drawn
        * 
        * @param e HTML element where editor is rendered
        * @returns {} 
        */
        onAfterRender(e: HTMLElement): void;

        /**
         * Is current editor valid (flag set by master editor)
         */
        IsValid: boolean;

        /**
         * Needed by editor in some cases
         * 
         * @returns {} 
         */
        focus(): void;

        /**
         * Collection with editor's recent validation messages
         */
        ValidationMessages: IValidationMessage[];

        notifyObjectChanged(): void;

        getErrorMessage(key: string): string;
    }
    export interface IValidationMessage {
        Message?: string;
        Code: string;
    }
}