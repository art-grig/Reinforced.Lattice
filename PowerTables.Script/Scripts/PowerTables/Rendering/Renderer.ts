module PowerTables.Rendering {

    /**
     * Enity responsible for displaying table
     */
    export class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, instances: InstanceManager, events: EventsManager,dateService:DateService) {
            this._instances = instances;
            this._stack = new RenderingStack();
            this.RootElement = document.getElementById(rootId);
            this._rootId = rootId;
            this._events = events;

            this.HandlebarsInstance = Handlebars.create();

            this.LayoutRenderer = new LayoutRenderer(this, this._stack, this._instances);
            this.ContentRenderer = new ContentRenderer(this, this._stack, this._instances);
            this.BackBinder = new BackBinder(this.HandlebarsInstance, instances, this._stack, dateService);

            this.HandlebarsInstance.registerHelper('ifq', this.ifqHelper);
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

        private _instances: InstanceManager;
        private _stack: RenderingStack;
        private _datepickerFunction: (e: HTMLElement) => void;
        private _templatesCache: { [key: string]: HandlebarsTemplateDelegate } = {};
        private _rootId: string;
        private _events: EventsManager;

        //#region Templates caching
        private cacheTemplates(templatesPrefix: string): void {
            var selector: string = `script[type="text/x-handlebars-template"][id^="${templatesPrefix}-"]`;
            var templates: NodeList = document.querySelectorAll(selector);
            for (var i: number = 0; i < templates.length; i++) {
                var item: HTMLElement = <HTMLElement>templates.item(i);
                var key: string = item.id.substring(templatesPrefix.length + 1);
                this._templatesCache[key] = this.HandlebarsInstance.compile(item.innerHTML);
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

            var rendered: string = this.getCachedTemplate('layout')(null);
            this.RootElement.innerHTML = rendered;

            var bodyMarker: Element = this.RootElement.querySelector('[data-track="tableBodyHere"]');
            if (!bodyMarker) throw new Error('{{Body}} placeholder is missing in table layout template');
            this.BodyElement = bodyMarker.parentElement;
            this.BodyElement.removeChild(bodyMarker);
            this.BackBinder.backBind(this.RootElement);
            this.Locator = new DOMLocator(this.BodyElement, this.RootElement, this._rootId);

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
            this.BodyElement.innerHTML = html;
            this._events.AfterDataRendered.invoke(this, null);
        }

        /**
         * Redraws specified plugin refreshing all its graphical state 
         * 
         * @param plugin Plugin to redraw
         * @returns {} 
         */
        public redrawPlugin(plugin: IPlugin): void {
            this._stack.clear();
            var oldPluginElement: HTMLElement = this.Locator.getPluginElement(plugin);
            var parent: HTMLElement = oldPluginElement.parentElement;
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            var html: string = this.LayoutRenderer.renderPlugin(plugin);
            var newPluginElement: HTMLElement = parser.html2Dom(html);

            parent.replaceChild(newPluginElement, oldPluginElement);
            this.BackBinder.backBind(newPluginElement);
        }

        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public redrawRow(row: IRow): void {
            this._stack.clear();
            this._stack.push(RenderingContextType.Row, row);
            var wrapper: (arg: any) => string = this.getCachedTemplate('rowWrapper');
            var html: string;
            if (row.renderElement) {
                html = row.renderElement(this);
            } else {
                html = wrapper(row);
            }
            this._stack.popContext();
            var oldElement: HTMLElement = this.Locator.getRowElement(row);
            this.replaceElement(oldElement, html);
        }

        /**
         * Redraws specified row refreshing all its graphical state
         * 
         * @param row 
         * @returns {} 
         */
        public appendRow(row: IRow, afterRowAtIndex: number): void {
            this._stack.clear();
            var wrapper: (arg: any) => string = this.getCachedTemplate('rowWrapper');
            var html: string;
            if (row.renderElement) {
                html = row.renderElement(this);
            } else {
                html = wrapper(row);
            }
            var referenceNode: HTMLElement = this.Locator.getRowElementByIndex(afterRowAtIndex);
            var newRowElement: HTMLElement = this.createElement(html);
            referenceNode.parentNode.insertBefore(newRowElement, referenceNode.nextSibling);
        }

        /**
         * Removes referenced row by its index
         * 
         * @param rowDisplayIndex 
         * @returns {} 
         */
        public removeRowByIndex(rowDisplayIndex: number): void {
            var referenceNode: HTMLElement = this.Locator.getRowElementByIndex(rowDisplayIndex);
            referenceNode.parentElement.removeChild(referenceNode);
        }

        /**
         * Redraws header for specified column
         * 
         * @param column Column which header is to be redrawn         
         */
        public redrawHeader(column: IColumn): void {
            this._stack.clear();
            var html: string = this.LayoutRenderer.renderHeader(column);
            var oldHeaderElement: HTMLElement = this.Locator.getHeaderElement(column.Header);
            var newElement: HTMLElement = this.replaceElement(oldHeaderElement, html);
            this.BackBinder.backBind(newElement);
        }

        private createElement(html: string): HTMLElement {
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            return parser.html2Dom(html);
        }

        private replaceElement(element: HTMLElement, html: string): HTMLElement {
            var node: HTMLElement = this.createElement(html);
            element.parentElement.replaceChild(node, element);
            return node;
        }

        /**
         * Removes all dynamically loaded content in table
         * 
         * @returns {} 
         */
        public clearBody(): void {
            //this.BodyElement.innerHTML = '';
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