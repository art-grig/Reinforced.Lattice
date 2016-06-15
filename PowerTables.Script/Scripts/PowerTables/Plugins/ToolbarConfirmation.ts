module PowerTables.Plugins.Toolbar {
    /**
     * Backing class for confirmation panel created as part of button action
     */
    export class ToolbarConfirmation {
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
/*
 * @internal
 */
        public  AfterConfirm: ((form: any) => void)[] = [];
       
        private _beforeReject: ((form: any) => void)[] = [];
/*
 * @internal
 */
        public AfterReject: ((form: any) => void)[] = [];
/*
 * @internal
 */
        public AfterConfirmationResponse: ((form: any) => void)[] = [];
/*
 * @internal
 */
        public ConfirmationResponseError: ((form: any) => void)[] = [];

        public Form: any = null;

        RootElement: HTMLElement;
        SelectedItems: string[];
        SelectedObjects: any[];

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
/*
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

        public confirmHandle() {
            this.collectFormData();
            this.fireEvents(this.Form, this._beforeConfirm);
            this._confirm(this.Form);
            this.fireEvents(this.Form, this.AfterConfirm);
        }

        public dismissHandle() {
            this.collectFormData();
            this.fireEvents(this.Form, this._beforeReject);
            this._reject();
            this.fireEvents(this.Form, this.AfterReject);
        }

        public onBeforeConfirm(fn:(form: any) => void) { this._beforeConfirm.push(fn); }
        public onAfterConfirm(fn: (form: any) => void) { this.AfterConfirm.push(fn); }
        
        public onBeforeReject(fn: (form: any) => void) { this._beforeReject.push(fn); }
        public onAfterReject(fn: (form: any) => void) { this.AfterReject.push(fn); }

        public onAfterConfirmationResponse(fn: (form: any) => void) { this.AfterConfirmationResponse.push(fn); }
        public onConfirmationResponseError(fn: (form: any) => void) { this.ConfirmationResponseError.push(fn); }
        

    }
} 