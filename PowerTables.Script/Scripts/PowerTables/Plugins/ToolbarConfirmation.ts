module PowerTables.Plugins {
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

        RootElement:HTMLElement;
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

        public confirmHandle() {
            var form = {};
            if (this._autoform != null) {
                form = FormwatchPlugin.extractFormData(this._autoform, this.RootElement, this._date);
            } 
            this._confirm(form);
        }

        public dismissHandle() {
            this._reject();
        }

    }
} 