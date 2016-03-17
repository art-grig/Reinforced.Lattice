module PowerTables {
    import FormwatchClientConfiguration = PowerTables.Plugins.Formwatch.IFormwatchClientConfiguration;

    export class FormwatchPlugin
        extends PluginBase<FormwatchClientConfiguration>
        implements IQueryPartProvider {


        IsQueryModifier: boolean = true;
        IsRenderable: boolean = false;
        PluginId: string = 'Formwatch';
        private _existingValues: { [key: string]: any } = {};
        private _filteringExecuted: { [key: string]: boolean } = {};
        private _timeouts: { [key: string]: number } = {};

        modifyQuery(query: IQuery): void {
            var result = { }
            for (var i = 0; i < this.Configuration.FieldsConfiguration.length; i++) {
                var fieldConf = this.Configuration.FieldsConfiguration[i];
                var value = null;
                var name = fieldConf.FieldJsonName;

                if (fieldConf.ConstantValue) {
                    value = fieldConf.ConstantValue;
                } else {
                    if (fieldConf.FieldValueFunction) {
                        value = fieldConf.FieldValueFunction();
                    } else {
                        var element = <HTMLInputElement>document.querySelector(fieldConf.FieldSelector);
                        if (element) {
                            if (element.type === 'select-multiple') {
                                var o = <HTMLSelectElement><any>element;
                                value = [];
                                for (var k = 0; k < o.options.length; k++) {
                                    if (o.options[k].selected) value.push(o.options[k].value);
                                }
                            } else if (element.type === 'checkbox') {
                                value = element.checked;
                            }
                            else {
                                value = element.value;
                            }
                        }
                    }
                    if (fieldConf.SetConstantIfNotSupplied && !value) {
                        value = fieldConf.ConstantValue;
                    }
                }
                result[name] = value;
            }
            var str = JSON.stringify(result);
            query.AdditionalData['Formwatch'] = str;
        }

        subscribe(e: EventsManager): void {
            for (var i = 0; i < this.Configuration.FieldsConfiguration.length; i++) {
                var conf = this.Configuration.FieldsConfiguration[i];
                if (conf.TriggerSearchOnEvents && conf.TriggerSearchOnEvents.length > 0) {
                    var element = <HTMLInputElement>document.querySelector(conf.FieldSelector);
                    for (var j = 0; j < conf.TriggerSearchOnEvents.length; j++) {
                        var evtToTrigger = conf.TriggerSearchOnEvents[j];
                        element.addEventListener(evtToTrigger,
                            ((c, el) => (evt: Event) => {
                                this.fieldChange(c.FieldSelector, c.SearchTriggerDelay, el, evt);
                            })(conf, element)
                            );
                    }
                    this._existingValues[conf.FieldSelector] = element.value;
                }
            }
        }


        fieldChange(fieldSelector: string, delay:number, element: HTMLInputElement, e: Event) {
            if (this._filteringExecuted[fieldSelector]) return;

            if (element.value === this._existingValues[fieldSelector]) {
                return;
            }
            this._existingValues[fieldSelector] = element.value;

            if (delay > 0) {
                if (this._timeouts[fieldSelector]) clearTimeout(this._timeouts[fieldSelector]);
                this._timeouts[fieldSelector] = setTimeout(() => {
                    this._filteringExecuted[fieldSelector] = true;
                    this.MasterTable.reload();
                    this._filteringExecuted[fieldSelector] = false;
                }, 500);

            } else {
                this._filteringExecuted[fieldSelector] = true;
                this.MasterTable.reload();
                this._filteringExecuted[fieldSelector] = false;
            }
        }
    }
    ComponentsContainer.registerComponent('Formwatch', FormwatchPlugin);
} 