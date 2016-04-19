module PowerTables.Plugins {
    export class ToolbarConfirmation {
        constructor(confirm: (form: any) => void, reject: () => void, date: DateService) {
            this._confirm = confirm;
            this._reject = reject;
            this._date = date;
        }

        private _confirm: (form: any) => void;
        private _reject: () => void;
        private _date: DateService;

        FormElements: { [key: string]: HTMLElement } = {};

        SelectedItems: string[];
        SelectedObjects: any[];

        public confirmHandle() {
            var form = {};
            for (var k in this.FormElements) {
                var kt = k.split('-'),
                    fieldName = kt[0],
                    fieldType = InstanceManager.classifyType(kt[1]),
                    value,
                    element = <HTMLInputElement>this.FormElements[k];

                if (element.type === 'select-multiple') {
                    var o = <HTMLSelectElement><any>element;
                    value = [];
                    for (var i = 0; i < o.options.length; i++) {
                        if (o.options[i].selected) value.push(o.options[i].value);
                    }
                } else if (element.type === 'checkbox') {
                    value = element.checked;
                }
                else {
                    if (fieldType.IsDateTime) {
                        value = this._date.getDateFromDatePicker(element);
                        if (!this._date.isValidDate(value)) {
                            value = this._date.parse(element.value);
                            if (!this._date.isValidDate(value)) {
                                value = null;
                            }
                        }
                    } else {
                        value = element.value;
                    }
                }
                form[fieldName] = value;
            }
            this._confirm(form);
        }

        public rejectHandle() {
            this._reject();
        }

    }
} 