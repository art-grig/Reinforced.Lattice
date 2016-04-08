module PowerTables.Rendering {

    /**
     * Enity responsible for displaying table
     */
    export class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, isColumnDateTimeFunc: (s: string) => boolean, instances: InstanceManager) {
            this._isColumnDateTimeFunc = isColumnDateTimeFunc;
            this._instances = instances;
            this._stack = new RenderingStack();
            this.RootElement = document.getElementById(rootId);
            this.HandlebarsInstance = Handlebars.create();

            this._layoutRenderer = new LayoutRenderer(this, this._stack, this._instances);
            this._contentRenderer = new ContentRenderer(this, this._stack, this._instances);

            this.HandlebarsInstance.registerHelper("ifq", this.ifqHelper);
            this.HandlebarsInstance.registerHelper('Content', this.contentHelper.bind(this));
            this.HandlebarsInstance.registerHelper('Track', this.trackHelper.bind(this));
            this.HandlebarsInstance.registerHelper('Datepicker', this.datepickerHelper.bind(this));

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

        private _isColumnDateTimeFunc: (s: string) => boolean;
        private _instances: InstanceManager;
        private _layoutRenderer: LayoutRenderer;
        private _contentRenderer: ContentRenderer;
        private _stack: RenderingStack;
        private _datepickerFunction: (e: HTMLElement) => void;
        private _templatesCache: { [key: string]: HandlebarsTemplateDelegate } = {};

        //#region Templates caching
        private cacheTemplates(templatesPrefix: string): void {
            var selector = `script[type="text/x-handlebars-template"][id^="${templatesPrefix}-"]`;
            var templates = document.querySelectorAll(selector);
            for (var i = 0; i < templates.length; i++) {
                var item = <HTMLElement>templates.item(i);
                var key = item.id.substring(templatesPrefix.length + 1);
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
            var rendered = this.getCachedTemplate('layout')(null);
            this.RootElement.innerHTML = rendered;

            var bodyMarker = this.RootElement.querySelector('[data-track="tableBodyHere"]');
            if (!bodyMarker) throw new Error('{{Body}} placeholder is missing in table layout template');
            this.BodyElement = bodyMarker.parentElement;
            this.BodyElement.removeChild(bodyMarker);
            this._layoutRenderer.bindEventsQueue(this.RootElement);
        }

        /**
         * Clear dynamically loaded table content and replace it with new one
         * 
         * @param rows Set of table rows         
         */
        public body(rows: IRow[]): void {
            this.clearBody();
            this.BodyElement.innerHTML = this._contentRenderer.renderBody(rows);
        }


        public clearBody(): void {
            this.BodyElement.innerHTML = '';
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
                        return this._layoutRenderer.renderContent(columnName);
                    case RenderingContextType.Row:
                    case RenderingContextType.Cell:
                        return this._contentRenderer.renderContent(columnName);
                    default:
                        throw new Error("Unknown rendering context type");

                }
            }
        }

        private trackHelper(): string {
            var trk = this._stack.Current.CurrentTrack;
            if (trk.length === 0) return '';
            return `data-track="${trk}"`;
        }

        private datepickerHelper(): string {
            if (this._stack.Current.Type === RenderingContextType.Plugin) {
                if (this._isColumnDateTimeFunc(this._stack.Current.ColumnName)) {
                    return 'data-dp="true"';
                } else {
                    return '';
                }
            } else {
                return '';
            }
        }

        private ifqHelper(a: any, b: any, opts: any) {
            if (a == b)
                return opts.fn(this);
            else
                return opts.inverse(this);
        }
        //#endregion
    }
} 