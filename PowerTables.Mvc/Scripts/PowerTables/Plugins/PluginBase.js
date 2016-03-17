var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var PluginBase = (function (_super) {
        __extends(PluginBase, _super);
        function PluginBase(templateId) {
            _super.call(this, templateId);
            this.IsToolbarPlugin = false;
            this.IsQueryModifier = false;
            this.IsRenderable = true;
            this.PluginId = '';
        }
        PluginBase.prototype.init = function (table, configuration) {
            this.Configuration = configuration.Configuration;
            this.MasterTable = table;
        };
        return PluginBase;
    })(PowerTables.RenderableComponent);
    PowerTables.PluginBase = PluginBase;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=PluginBase.js.map