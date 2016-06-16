module PowerTables.Plugins.Toolbar {
    /**
     * Backing class for confirmation panel created as part of button action
     */
    export class CommandConfirmation {

        /**
         * @internal
         */
        constructor(confirm: (form: any) => void, reject: () => void, date: DateService, autoform: PowerTables.Plugins.Formwatch.IFormwatchFieldData[]) {
            this._confirm = confirm;
            this._reject = reject;
            this._date = date;
            this._autoform = autoform;
        }

        private _autoform: PowerTables.Plugins.Formwatch.IFormwatchFieldData[];
        private _confirm: (form: any) => void;
        private _reject: () => void;
        private _date: DateService;
        private _beforeConfirm: ((form: any) => void)[] = [];

        /**
         * @internal
         */
        public AfterConfirm: ((form: any) => void)[] = [];

        private _beforeReject: ((form: any) => void)[] = [];

        /**
         * @internal
         */
        public AfterReject: ((form: any) => void)[] = [];

        /**
         * @internal
         */
        public AfterConfirmationResponse: ((form: any) => void)[] = [];

        /**
         * @internal
         */
        public ConfirmationResponseError: ((form: any) => void)[] = [];

        /**
         * Set of form values (available only after window is commited or dismissed)
         */
        public Form: any = null;

        /**
         * Reference to root element of confirmation window
         */
        RootElement: HTMLElement;

        /**
         * Set of selected item keys defined in corresponding Checboxify plugin
         */
        SelectedItems: string[];

        /**
         * Set of selected corresponding objects selected by checkboxify plugin
         */
        SelectedObjects: any[];

        /**
         * @internal         
         */
        public onRender(parent: HTMLElement) {
            this.RootElement = parent;
            if (this._autoform != null) {
                for (var i = 0; i < this._autoform.length; i++) {
                    var conf = this._autoform[i];
                    if (conf.TriggerSearchOnEvents && conf.TriggerSearchOnEvents.length > 0) {
                        var element = <HTMLInputElement>document.querySelector(conf.FieldSelector);
                        if (conf.AutomaticallyAttachDatepicker) {
                            this._date.createDatePicker(element);
                        }
                    }
                }
            }
        }


/**
 * @internal
 */
        public fireEvents(form: any, array: ((form: any) => void)[]) {
            for (var i = 0; i < array.length; i++) {
                array[i](form);
            }
        }

        private collectFormData() {
            if (this.Form != null) return;
            var form = {};
            if (this._autoform != null) {
                form = PowerTables.Plugins.Formwatch.FormwatchPlugin.extractFormData(this._autoform, this.RootElement, this._date);
            }
            this.Form = form;
        }

        /**
         * Commits confirmation form, collects form, destroys confirmation panel element and proceeds server command, fires corresponding events
         */
        public confirm(): void {
            this.collectFormData();
            this.fireEvents(this.Form, this._beforeConfirm);
            this._confirm(this.Form);
            this.fireEvents(this.Form, this.AfterConfirm);
        }

        /**
         * Destroys confirmation panel element, collects form, does not send anything to server, fires corresponding events
         */
        public dismiss(): void {
            this.collectFormData();
            this.fireEvents(this.Form, this._beforeReject);
            this._reject();
            this.fireEvents(this.Form, this.AfterReject);
        }

        /**
         * Subscribes specified function to be invoked after pressing confirm button (or calling confirm method) but before processing
         * @param fn Function that consumes form data
         */
        public onBeforeConfirm(fn: (form: any) => void): void { this._beforeConfirm.push(fn); }

        /**
         * Subscribes specified function to be invoked after pressing confirm button and client-side form processing (it is possible to add something to form) 
         * but before sending data to server
         * @param fn Function that consumes form data
         */
        public onAfterConfirm(fn: (form: any) => void): void { this.AfterConfirm.push(fn); }

        /**
         * Subscribes specified function to be invoked after pressing reject button (or calling reject method) but before processing
         * @param fn Function that consumes form data
         */
        public onBeforeReject(fn: (form: any) => void): void { this._beforeReject.push(fn); }

        /**
         * Subscribes specified function to be invoked after pressing reject button (or calling reject method) but before processing
         * @param fn Function that consumes form data
         */
        public onAfterReject(fn: (form: any) => void): void { this.AfterReject.push(fn); }

        public onAfterConfirmationResponse(fn: (form: any) => void): void { this.AfterConfirmationResponse.push(fn); }
        public onConfirmationResponseError(fn: (form: any) => void): void { this.ConfirmationResponseError.push(fn); }


    }
} 