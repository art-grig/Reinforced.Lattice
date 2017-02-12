declare module PowerTables.Rendering {
    /**
     * Enity responsible for displaying table
     */
    class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, instances: InstanceManager, events: EventsManager, dateService: DateService, coreTemplates: ICoreTemplateIds);
        /**
         * Parent element for whole table
         */
        RootElement: HTMLElement;
        /**
         * Parent element for table entries
         */
        BodyElement: HTMLElement;
        /**
        * Current handlebars.js engine instance
        */
        HandlebarsInstance: Handlebars.IHandlebars;
        /**
         * Locator of particular table parts in DOM
         */
        Locator: DOMLocator;
        /**
         * BackBinder instance
         */
        BackBinder: BackBinder;
        /**
         * Renderer that is responsible for layout rendering
         */
        LayoutRenderer: LayoutRenderer;
        /**
         * Entity that is responsible for content rendering
         */
        ContentRenderer: ContentRenderer;
        /**
         * Entity that is responsible for existing DOM modifications
         */
        Modifier: DOMModifier;
        /**
         * API that is responsible for UI events delegation
         */
        Delegator: EventsDelegator;
        private _instances;
        private _stack;
        private _datepickerFunction;
        private _templatesCache;
        private _rootId;
        private _events;
        private _templateIds;
        private cacheTemplates(templatesPrefix);
        /**
         * Retrieves cached template handlebars function
         * @param Template Id
         * @returns Handlebars function
         */
        getCachedTemplate(templateId: string): (arg: any) => string;
        /**
         * Perform table layout inside specified root element
         */
        layout(): void;
        /**
         * Clear dynamically loaded table content and replace it with new one
         *
         * @param rows Set of table rows
         */
        body(rows: IRow[]): void;
        renderObject(templateId: string, viewModelBehind: any, targetSelector: string): HTMLElement;
        destroyObject(targetSelector: string): void;
        /**
         * Removes all dynamically loaded content in table
         *
         * @returns {}
         */
        clearBody(): void;
        contentHelper(columnName?: string): string;
        private trackHelper();
        private ifqHelper(a, b, opts);
        private ifcompHelper(a, b, comparison, opts);
        private iflocHelper(location, opts);
    }
}
