module PowerTables.Rendering {

    /**
     * Enity responsible for displaying table
     */
    export class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._instances = masterTable.InstanceManager;
            this._stack = new RenderingStack();
            this.RootElement = document.getElementById(rootId);
            this._rootId = rootId;
            this._events = masterTable.Events;
            this._templateIds = this._instances.Configuration.CoreTemplates;

            this.HandlebarsInstance = Handlebars.create();

            this.LayoutRenderer = new LayoutRenderer(this, this._stack, this._instances, this._templateIds);
            this.ContentRenderer = new ContentRenderer(this, this._stack, this._instances, this._templateIds);
            this.BackBinder = new BackBinder(this.HandlebarsInstance, this._instances, this._stack, this._masterTable.Date);
            

            this.HandlebarsInstance.registerHelper('ifq', this.ifqHelper);
            this.HandlebarsInstance.registerHelper('ifcmp', this.ifcompHelper);
            this.HandlebarsInstance.registerHelper('ifloc', this.iflocHelper.bind(this));
            this.HandlebarsInstance.registerHelper('Content', this.contentHelper.bind(this));
            this.HandlebarsInstance.registerHelper('Track', this.trackHelper.bind(this));

            this.cacheTemplates(prefix);
        }

        /**
         * Parent element for whole table
         */
        public RootElement: HTMLElement;

        /**
         * Parent element for table entries
         */
        public BodyElement: HTMLElement;

        /**
        * Current handlebars.js engine instance
        */
        public HandlebarsInstance: Handlebars.IHandlebars;

        /**
         * Locator of particular table parts in DOM
         */
        public Locator: DOMLocator;

        /**
         * BackBinder instance
         */
        public BackBinder: BackBinder;

        /**
         * Renderer that is responsible for layout rendering
         */
        public LayoutRenderer: LayoutRenderer;

        /**
         * Entity that is responsible for content rendering
         */
        public ContentRenderer: ContentRenderer;

        /**
         * Entity that is responsible for existing DOM modifications
         */
        public Modifier: DOMModifier;

        /**
         * API that is responsible for UI events delegation
         */
        public Delegator: EventsDelegator;

        private _masterTable: IMasterTable;
        private _instances: InstanceManager;
        private _stack: RenderingStack;
        private _datepickerFunction: (e: HTMLElement) => void;
        private _templatesCache: { [key: string]: HandlebarsTemplateDelegate } = {};
        private _rootId: string;
        private _events: EventsManager;
        private _templateIds: ICoreTemplateIds;

        //#region Templates caching
        private cacheTemplates(templatesPrefix: string): void {
            var selector: string = `script[type="text/x-handlebars-template"][id^="${templatesPrefix}-"]`;
            var templates: NodeList = document.querySelectorAll(selector);
            for (var i: number = 0; i < templates.length; i++) {
                var item: HTMLElement = <HTMLElement>templates.item(i);
                var key: string = item.id.substring(templatesPrefix.length + 1);
                this._templatesCache[key] = this.HandlebarsInstance.compile(item.innerHTML.substring('<!--'.length, item.innerHTML.length - ('-->'.length)), { noEscape: true });
            }
        }

        /**
         * Retrieves cached template handlebars function
         * @param Template Id 
         * @returns Handlebars function
         */
        public getCachedTemplate(templateId: string): (arg: any) => string {
            if (!this._templatesCache.hasOwnProperty(templateId))
                throw new Error(`Cannot find template ${templateId}`);
            return this._templatesCache[templateId];
        }

        //#endregion

        //#region Public methods
        /**
         * Perform table layout inside specified root element         
         */
        public layout(): void {
            this._events.BeforeLayoutRendered.invoke(this, null);

            var rendered: string = this.getCachedTemplate(this._templateIds.Layout)(null);
            this.RootElement.innerHTML = rendered;

            var bodyMarker: Element = this.RootElement.querySelector('[data-track="tableBodyHere"]');
            if (!bodyMarker) throw new Error('{{Body}} placeholder is missing in table layout template');
            this.BodyElement = bodyMarker.parentElement;
            this.BodyElement.removeChild(bodyMarker);

            this.Locator = new DOMLocator(this.BodyElement, this.RootElement, this._rootId);
            this.Delegator = new EventsDelegator(this.Locator, this.BodyElement, this.RootElement, this._rootId, this._masterTable);
            this.BackBinder.Delegator = this.Delegator;
            this.Modifier = new DOMModifier(this._stack, this.Locator, this.BackBinder, this, this.LayoutRenderer, this._instances, this.Delegator);


            this.BackBinder.backBind(this.RootElement);
            this._events.AfterLayoutRendered.invoke(this, null);
        }

        /**
         * Clear dynamically loaded table content and replace it with new one
         * 
         * @param rows Set of table rows         
         */
        public body(rows: IRow[]): void {
            this._events.BeforeClientRowsRendering.invoke(this, rows);
            this.clearBody();
            var html: string = this.ContentRenderer.renderBody(rows);
            this.Delegator.handleElementDestroy(this.BodyElement);
            this.BodyElement.innerHTML = html;
            this.BackBinder.backBind(this.BodyElement);
            this._events.AfterDataRendered.invoke(this, null);
        }

        public renderObject(templateId: string, viewModelBehind: any, targetSelector: string): HTMLElement {
            var parent = <HTMLElement>document.querySelector(targetSelector);
            this._stack.clear();
            this._stack.push(RenderingContextType.Custom, viewModelBehind);
            var html = this.getCachedTemplate(templateId)(viewModelBehind);
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            var element = parser.html2DomElements(html);
            parent.innerHTML = '';
            for (var i = 0; i < element.length; i++) {
                parent.appendChild(element[i]);
            }
            this.BackBinder.backBind(parent);
            return parent;
        }

        public destroyObject(targetSelector: string) {
            var parent = <HTMLElement>document.querySelector(targetSelector);
            this.Delegator.handleElementDestroy(parent);
            parent.innerHTML = '';
        }

        /**
         * Removes all dynamically loaded content in table
         * 
         * @returns {} 
         */
        public clearBody(): void {
            if (this.Delegator) {
                this.Delegator.handleElementDestroy(this.BodyElement);
            }
            while (this.BodyElement.firstChild) {
                this.BodyElement.removeChild(this.BodyElement.firstChild);
            }
        }

        //#endregion

        //#region Helpers
        public contentHelper(columnName?: string): string {
            if (this._stack.Current.Object.renderContent) {
                return this._stack.Current.Object.renderContent(this);
            } else {
                switch (this._stack.Current.Type) {
                    case RenderingContextType.Header:
                    case RenderingContextType.Plugin:
                        return this.LayoutRenderer.renderContent(columnName);
                    case RenderingContextType.Row:
                    case RenderingContextType.Cell:
                        return this.ContentRenderer.renderContent(columnName);
                    default:
                        throw new Error('Unknown rendering context type');

                }
            }
        }

        private trackHelper(): string {
            var trk: string = this._stack.Current.CurrentTrack;
            if (trk.length === 0) return '';
            return `data-track="${trk}"`;
        }

        private ifqHelper(a: any, b: any, opts: any) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }

        private ifcompHelper(a: any, b: any, comparison: any, opts: any) {
            var comp = eval(comparison);
            if (comp)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }

        private iflocHelper(location: string, opts: any) {
            if (this._stack.Current.Type === RenderingContextType.Plugin) {
                var loc: string = (<IPlugin>this._stack.Current.Object).PluginLocation;
                if (loc.length < location.length) return opts.inverse(this);
                if (loc.length === location.length && loc === location) return opts.fn(this);
                if (loc.substring(0, location.length) === location) return opts.fn(this);
            }
            return opts.inverse(this);
        }

        //#endregion
    }
}