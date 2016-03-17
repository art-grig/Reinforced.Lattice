module PowerTables {

    export class RenderableComponent implements IRenderableComponent {
        constructor(templateId?: string) {
            if (!templateId) {
                this._templateId = null;
            } else {
                this._templateId = templateId;
            }
        }
        public Element: JQuery = null;

        private _templateId: string;
        private _templateDelegate: HandlebarsTemplateDelegate;

        public setTemplateId(templateId?: string): void {
            if (!templateId) {
                this._templateId = null;
            }
            this._templateDelegate = null;
        }

        public resetTemplateDelegate() {
            this._templateDelegate = null;
        }

        public renderTo(parentElement: JQuery, context?: any): JQuery {
            var html = $(this.render(context));
            this.Element = html;
            var e = parentElement.append(html);
            this.subscribeEvents(e);
            return html;
        }

        public getTemplateContent():string {
            return $('#' + this._templateId).html();
        }
        protected DontCacheDelegate: boolean;

        public render(context?: any): string {
            if (!this._templateDelegate) {
                this._templateDelegate = Handlebars.compile(this.getTemplateContent());
            }
            var html = context ? this._templateDelegate(context) : this._templateDelegate(this);
            if (this.DontCacheDelegate) this.resetTemplateDelegate();
            return html;
        }

        public subscribeEvents(parentElement: JQuery): void {

        }
    }
} 