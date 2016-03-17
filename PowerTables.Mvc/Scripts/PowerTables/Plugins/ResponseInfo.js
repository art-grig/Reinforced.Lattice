var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var ResponseInfoPlugin = (function (_super) {
        __extends(ResponseInfoPlugin, _super);
        function ResponseInfoPlugin() {
            _super.call(this, 'pt-responseinfo');
            this.IsToolbarPlugin = false;
            this.PluginId = 'ResponseInfo';
            this.IsRenderable = true;
            this.IsQueryModifier = false;
        }
        ResponseInfoPlugin.prototype.init = function (table, configuration) {
            this._configuration = configuration.Configuration;
            table.Events.ResponseDrawing.subscribe(this.onResponse.bind(this), 'ResponseInfo');
        };
        ResponseInfoPlugin.prototype.onResponse = function (response) {
            this._element.empty();
            if (this._configuration.ResponseObjectOverride) {
                this.renderTo(this._element, response.AdditionalData['ResponseInfo']);
            }
            else {
                this.renderTo(this._element, response);
            }
        };
        ResponseInfoPlugin.prototype.subscribeEvents = function (parentElement) {
            if (this._element)
                return;
            this._element = parentElement;
            parentElement.empty();
        };
        ResponseInfoPlugin.prototype.getTemplateContent = function () {
            if (this._configuration.TemplateText) {
                return this._configuration.TemplateText;
            }
            else {
                return $('#pt-responseinfo').html();
            }
        };
        return ResponseInfoPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.ResponseInfoPlugin = ResponseInfoPlugin;
    PowerTables.ComponentsContainer.registerComponent('ResponseInfo', ResponseInfoPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=ResponseInfo.js.map