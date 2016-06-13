declare module PowerTables.Plugins {
    class FormwatchPlugin extends PluginBase<PowerTables.Plugins.Formwatch.IFormwatchClientConfiguration> implements IQueryPartProvider {
        private _existingValues;
        private _filteringExecuted;
        private _timeouts;
        private static extractValueFromMultiSelect(o);
        private static extractInputValue(element, fieldConf, dateService);
        private static extractData(elements, fieldConf, dateService);
        static extractFormData(configuration: PowerTables.Plugins.Formwatch.IFormwatchFieldData[], rootElement: any, dateService: DateService): {};
        modifyQuery(query: IQuery, scope: QueryScope): void;
        subscribe(e: EventsManager): void;
        fieldChange(fieldSelector: string, delay: number, element: HTMLInputElement, e: Event): void;
        init(masterTable: IMasterTable): void;
    }
}
