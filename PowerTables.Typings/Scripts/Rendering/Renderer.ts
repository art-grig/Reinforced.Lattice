module PowerTables.Rendering {
    export class Renderer implements ITemplatesProvider {
        private _rootElement: HTMLElement;
        private _bodyElement: HTMLElement;
        private _layoutRenderer: LayoutRenderer;
        private _contentRenderer: ContentRenderer;
        private _renderingStack: RenderingStack;
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
            var result = '';
            var wrapper = this.getCachedTemplate('rowWrapper');
            for (var i = 0; i < rows.length; i++) {
                var rw = rows[i];
                this._currentRow = rw;
                if (rw.renderElement) {
                    result += rw.renderElement(this);
                } else {
                    result += wrapper(rw);
                }
            }
            this._bodyElement.innerHTML = result;
            this.bindEventsQueue(this._bodyElement);
        }

        clearBody(): void {
            this._bodyElement.innerHTML = '';
        }
    }
} 