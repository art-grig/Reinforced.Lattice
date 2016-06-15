declare module PowerTables.Plugins.Editors {
    class CellEditorBase<T> extends PluginBase<T> implements ICellEditor {
        /**
         * Is current editor valid (flag set by master editor)
         */
        IsValid: boolean;
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
         * Original, locally displayed data object
         */
        DataObject: any;
        /**
         * Value for particular editor column
         */
        Data: any;
        /**
         * Collection with editor's recent validation messages
         */
        ValidationMessages: IValidationMessage[];
        renderedValidationMessages(): string;
        /**
         * Retrieves original value for this particular cell editor
         *
         * @returns {Any} Original, unchanged value
         */
        protected getThisOriginalValue(): any;
        /**
         * Resets editor value to initial settings
         */
        reset(): void;
        /**
         * Data object that is modified within editing process
         */
        ModifiedDataObject: any;
        /**
         * Reference to parent editor
         */
        Row: Editor;
        /**
         * Corresponding column
         */
        Column: IColumn;
        /**
         * Flag when initial value setting occures
         */
        IsInitialValueSetting: boolean;
        /**
         * Returns entered editor value
         *
         * @returns {}
         */
        getValue(errors: IValidationMessage[]): any;
        /**
         * Sets editor value from the outside
         */
        setValue(value: any): void;
        /**
         * Template-bound event raising on changing this editor's value
         */
        changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        /**
         * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
         * Commit leads to validation. Cell editor should be notified
         */
        commitHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        /**
         * Event handler for reject (cancel editing) event raised from inside of CellEditor
         * Cell editor should be notified
         */
        rejectHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void;
        /**
         * Called when cell editor has been drawn
         *
         * @param e HTML element where editor is rendered
         * @returns {}
         */
        onAfterRender(e: HTMLElement): void;
        /**
         * Needed by editor in some cases
         *
         * @returns {}
         */
        focus(): void;
        OriginalContent(): string;
    }
    interface ICellEditor extends IPlugin, ICell {
        /**
         * Plugin's visual states collection.
         * Usually it is not used, but always it is better to have one
         */
        VisualStates: PowerTables.Rendering.VisualState;
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
    }
}
