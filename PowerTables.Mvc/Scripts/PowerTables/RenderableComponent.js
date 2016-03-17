var PowerTables;
(function (PowerTables) {
    var RenderableComponent = (function () {
        function RenderableComponent(templateId) {
            this.Element = null;
            if (!templateId) {
                this._templateId = null;
            }
            else {
                this._templateId = templateId;
            }
        }
        RenderableComponent.prototype.setTemplateId = function (templateId) {
            if (!templateId) {
                this._templateId = null;
            }
            this._templateDelegate = null;
        };
        RenderableComponent.prototype.resetTemplateDelegate = function () {
            this._templateDelegate = null;
        };
        RenderableComponent.prototype.renderTo = function (parentElement, context) {
            var html = $(this.render(context));
            this.Element = html;
            var e = parentElement.append(html);
            this.subscribeEvents(e);
            return html;
        };
        RenderableComponent.prototype.getTemplateContent = function () {
            return $('#' + this._templateId).html();
        };
        RenderableComponent.prototype.render = function (context) {
            if (!this._templateDelegate) {
                this._templateDelegate = Handlebars.compile(this.getTemplateContent());
            }
            var html = context ? this._templateDelegate(context) : this._templateDelegate(this);
            if (this.DontCacheDelegate)
                this.resetTemplateDelegate();
            return html;
        };
        RenderableComponent.prototype.subscribeEvents = function (parentElement) {
        };
        return RenderableComponent;
    })();
    PowerTables.RenderableComponent = RenderableComponent;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=RenderableComponent.js.map