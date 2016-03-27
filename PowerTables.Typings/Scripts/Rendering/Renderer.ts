module PowerTables.Rendering {
    export class Renderer implements ITemplatesProvider {
        private _rootElement: HTMLElement;
        private _bodyElement: HTMLElement;

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
    }
} 