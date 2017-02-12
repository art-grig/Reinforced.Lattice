module Reinforced.Lattice.Plugins.Formwatch {
    export class FormwatchPlugin extends PluginBase<Reinforced.Lattice.Plugins.Formwatch.IFormwatchClientConfiguration>
        implements IQueryPartProvider {

        private _existingValues: { [key: string]: any } = {};
        private _filteringExecuted: { [key: string]: boolean } = {};
        private _timeouts: { [key: string]: number } = {};

        private static extractValueFromMultiSelect(o: HTMLSelectElement): any[] {
            var value = [];
            for (var k = 0; k < o.options.length; k++) {
                if ((<any>o.options[k]).selected) value.push((<any>o.options[k]).value);
            }
            return value;
        }

        private static extractInputValue(element: HTMLInputElement, fieldConf: Reinforced.Lattice.Plugins.Formwatch.IFormwatchFieldData, dateService: Reinforced.Lattice.Services.DateService): any {
            var value = null;
            if (element.type === 'select-multiple') {
                value = FormwatchPlugin.extractValueFromMultiSelect(<any>(element));
            } else if (element.type === 'checkbox') {
                value = element.checked;
            } else if (element.type === 'radio') {
                if (element.checked) value = element.value;
            }
            else {
                if (fieldConf.IsDateTime) {
                    value = dateService.getDateFromDatePicker(element);
                    if (!dateService.isValidDate(value)) {
                        value = dateService.parse(element.value);
                        if (!dateService.isValidDate(value)) {
                            value = null;
                        }
                    }
                    if (value != null) value = dateService.serialize(value);
                } else {
                    value = element.value;
                }
            }
            if (value != null && value != undefined) {
                if ((typeof value === 'string') && fieldConf.IsBoolean) {
                    value = (value.toUpperCase() === 'TRUE' || value === '1' || value === 'YES');
                }
            }
            return value;
        }


        private static extractData(elements: NodeListOf<Element>, fieldConf: Reinforced.Lattice.Plugins.Formwatch.IFormwatchFieldData, dateService: Reinforced.Lattice.Services.DateService): any {
            var value = null;
            var element = <HTMLInputElement>(elements.length > 0 ? elements.item(0) : null);
            if (element) {
                if (fieldConf.IsArray) {
                    if (fieldConf.ArrayDelimiter) {
                        if (element.value == null || element.value.length === 0) value = [];
                        else value = element.value.split(fieldConf.ArrayDelimiter);
                    } else {
                        if (elements.length === 1 && element.type === 'select-multiple') {
                            value = FormwatchPlugin.extractValueFromMultiSelect(<any>element);
                        } else {
                            value = [];
                            for (var i = 0; i < elements.length; i++) {
                                var el = <HTMLInputElement>elements.item(i);
                                var exv = FormwatchPlugin.extractInputValue(el, fieldConf, dateService);
                                if (el.type === 'checkbox') {
                                    if (exv === true) {
                                        exv = el.value;
                                    } else {
                                        continue;
                                    }
                                }
                                value.push(exv);
                            }
                        }
                    }
                } else {
                    for (var j = 0; j < elements.length; j++) {
                        var v = FormwatchPlugin.extractInputValue(<any>elements.item(j), fieldConf, dateService);    
                        if (v != null && v != undefined) {
                            
                            value = v;
                            break;
                        }
                    }
                    
                }
            }
            
            return value;
        }

        public static extractFormData(configuration: Reinforced.Lattice.Plugins.Formwatch.IFormwatchFieldData[], rootElement: any, dateService: Reinforced.Lattice.Services.DateService) {
            var result = {}
            for (var i = 0; i < configuration.length; i++) {
                var fieldConf = configuration[i];
                var value = null;
                var name = fieldConf.FieldJsonName;

                if (fieldConf.ConstantValue) {
                    value = fieldConf.ConstantValue;
                } else {
                    if (fieldConf.FieldValueFunction) {
                        value = fieldConf.FieldValueFunction();
                    } else {
                        var elements = rootElement.querySelectorAll(fieldConf.FieldSelector);
                        value = FormwatchPlugin.extractData(elements, fieldConf, dateService);
                    }
                    if (fieldConf.SetConstantIfNotSupplied && (value == null)) {
                        value = fieldConf.ConstantValue;
                    }
                }
                if (value != null || result[name] == null || result[name] == undefined) {
                    result[name] = value;
                }
            }
            return result;
        }
        modifyQuery(query: IQuery, scope: QueryScope): void {
            var result = FormwatchPlugin.extractFormData(this.Configuration.FieldsConfiguration, document, this.MasterTable.Date);
            for (var fm in this.Configuration.FiltersMappings) {
                if (this.Configuration.FiltersMappings.hasOwnProperty(fm)) {
                    var mappingConf = this.Configuration.FiltersMappings[fm];
                    var needToApply = (mappingConf.ForClient && mappingConf.ForServer)
                        || (mappingConf.ForClient && scope === QueryScope.Client)
                        || (mappingConf.ForServer && scope === QueryScope.Server)
                        || (scope === QueryScope.Transboundary);
                    if (needToApply) {
                        switch (mappingConf.FilterType) {
                            case 0:
                                var val = result[mappingConf.FieldKeys[0]];
                                if (!val || val.length === 0) break;
                                query.Filterings[fm] = val;
                                break;
                            case 1:
                                if (mappingConf.FieldKeys.length === 1 && (Object.prototype.toString.call(result[mappingConf[0]]) === '[object Array]')) {
                                    query.Filterings[fm] = `${result[mappingConf[0]][0]}|${result[mappingConf[0]][1]}`;
                                } else {
                                    query.Filterings[fm] = `${result[mappingConf.FieldKeys[0]]}|${result[mappingConf.FieldKeys[1]]}`;
                                }
                                break;
                            case 2:
                                if (mappingConf.FieldKeys.length === 1 && (Object.prototype.toString.call(result[mappingConf[0]]) === '[object Array]')) {
                                    query.Filterings[fm] = result[mappingConf[0]].join('|');
                                } else {
                                    var values = [];
                                    for (var m = 0; m < mappingConf.FieldKeys.length; m++) {
                                        values.push(result[mappingConf.FieldKeys[m]]);
                                    }
                                    query.Filterings[fm] = values.join('|');
                                }
                                break;
                        }
                    }
                }
            }
            if (this.Configuration.DoNotEmbed) return;
            var str = JSON.stringify(result);
            query.AdditionalData['Formwatch'] = str;
        }

        subscribe(e: Reinforced.Lattice.Services.EventsService): void {
            for (var i = 0; i < this.Configuration.FieldsConfiguration.length; i++) {
                var conf = this.Configuration.FieldsConfiguration[i];
                var element = <HTMLInputElement>document.querySelector(conf.FieldSelector);
                if (conf.AutomaticallyAttachDatepicker) {
                    this.MasterTable.Date.createDatePicker(element);
                }
                if (conf.TriggerSearchOnEvents && conf.TriggerSearchOnEvents.length > 0) {

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

        fieldChange(fieldSelector: string, delay: number, element: HTMLInputElement, e: Event) {
            if (this._filteringExecuted[fieldSelector]) return;

            if (element.value === this._existingValues[fieldSelector]) {
                return;
            }
            this._existingValues[fieldSelector] = element.value;

            if (delay > 0) {
                if (this._timeouts[fieldSelector]) clearTimeout(this._timeouts[fieldSelector]);
                this._timeouts[fieldSelector] = setTimeout(() => {
                    this._filteringExecuted[fieldSelector] = true;
                    this.MasterTable.Controller.reload();
                    this._filteringExecuted[fieldSelector] = false;
                }, delay);

            } else {
                this._filteringExecuted[fieldSelector] = true;
                this.MasterTable.Controller.reload();
                this._filteringExecuted[fieldSelector] = false;
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Loader.registerQueryPartProvider(this);
        }
    }
    ComponentsContainer.registerComponent('Formwatch', FormwatchPlugin);
} 