module PowerTables.Rendering {
    export class Renderer implements ITemplatesProvider {
        private _rootElement: HTMLElement;
        private _bodyElement: HTMLElement;
        private _layoutRenderer: LayoutRenderer;
        private _contentRenderer: ContentRenderer;
        private _stack: RenderingStack;
        private _datepickerFunction: (e: HTMLElement) => void;
        private _templatesCache: { [key: string]: HandlebarsTemplateDelegate } = {};

        /**
         * Current handlebars.js engine instance
         */
        public HandlebarsInstance: Handlebars.IHandlebars;

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

        layout(): void {
            // Layout renderer is indirectly called here
            var rendered = this.getCachedTemplate('layout')(null);
            // Browser rendering occurs here
            this._rootElement.innerHTML = rendered;

            var bodyMarker = this._rootElement.querySelector('[data-track="tableBodyHere"]');
            if (!bodyMarker) throw new Error('{{Body}} placeholder is missing in table layout template');
            this._bodyElement = bodyMarker.parentElement;
            this._bodyElement.removeChild(bodyMarker);
            this._layoutRenderer.bindEventsQueue(this._rootElement);
        }

        body(rows: IRow[]): void {
            this.clearBody();
            this._bodyElement.innerHTML = this._contentRenderer.renderBody(rows);
        }

        clearBody(): void {
            this._bodyElement.innerHTML = '';
        }

        public contentHelper(columnName?: string): string {
            if (this._stack.Current.Object.renderContent) {
                return this._stack.Current.Object.renderContent(this);
            } else {
                switch (this._stack.Current.Type) {
                    case RenderingContextType.Header:
                    case RenderingContextType.Plugin:
                    case RenderingContextType.Filter:
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
            if (this._currentContext.Type === RenderingContextType.Filter) {
                if (Helpers.isDateTime(this._columns[this._currentContext.ColumnName])) {
                    return 'data-dp="true"';
                } else {
                    return '';
                }

            } else {
                return '';
            }
        }
    }
} 