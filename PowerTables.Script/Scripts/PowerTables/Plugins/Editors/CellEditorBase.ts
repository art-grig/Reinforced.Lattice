module PowerTables.Plugins.Editors {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;

    export class CellEditorBase<T> extends PluginBase<T> implements ICellEditorBase {
        
        /**
         * Original, locally displayed data object
         */
        public OriginalDataObject: any;

        /**
         * Retrieves original value for this particular cell editor
         * 
         * @returns {Any} Original, unchanged value
         */
        protected getThisOriginalValue(): any {
            return this.OriginalDataObject[this.Column.RawName];
        }

        /**
         * Resets editor value to initial settings
         */
        public reset():void {
            this.setValue(this.getThisOriginalValue());
        }

        /**
         * Data object that is modified within editing process
         */
        public ModifiedDataObject: any;

        /**
         * Reference to parent editor
         */
        public Editor: Editor;

        /**
         * Corresponding column
         */
        public Column: IColumn;

        /**
         * Returns entered editor value
         * 
         * @returns {} 
         */
        public getValue(): any { throw new Error("Not implemented"); }

        /**
         * Sets editor value from the outside
         */
        public setValue(value: any): void { throw new Error("Not implemented"); }

        /**
         * Validates entered value and returns set of error messages
         * or null if entered value is valid
         * 
         * @returns {Array} Array of  
         */
        public validate(): string[]{ return []; }

        /**
         * Template-bound event raising on changing this editor's value 
         */
        public changed(e: TemplateBoundEvent): void {
            this.Editor.notifyChanged(this);
        }

        /**
         * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
         * Commit leads to validation. Cell editor should be notified
         */
        public commitHandler(e: TemplateBoundEvent): void { }

        /**
         * Event handler for reject (cancel editing) event raised from inside of CellEditor
         * Cell editor should be notified
         */
        public rejectHandler(e: TemplateBoundEvent): void { }
    }

    export interface ICellEditorBase {
        /**
         * Original, locally displayed data object
         */
        OriginalDataObject: any;
        /**
         * Template-bound event raising on changing this editor's value     
         */
        changed(e: TemplateBoundEvent): void;

        /**
         * Validates entered value and returns set of error messages
         * or null if entered value is valid
         * 
         * @returns {Array} Array of  
         */
        validate(): string[];

        /**
         * Returns entered editor value
         * 
         * @returns {} 
         */
        getValue(): any;

        /**
         * Sets editor value from the outside
         */
        setValue(value: any): void;
        /**
         * Reference to parent editor
         */
        Editor: Editor;

        /**
         * Corresponding column
         */
        Column: IColumn;

        /**
         * Resets editor value to initial settings
         */
        reset(): void;
    }
} 