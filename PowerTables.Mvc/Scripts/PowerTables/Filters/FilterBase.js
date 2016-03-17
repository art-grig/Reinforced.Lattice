var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var FilterBase = (function (_super) {
        __extends(FilterBase, _super);
        function FilterBase(templateId, column) {
            _super.call(this, templateId);
            this.Column = column;
            this.Table = column.MasterTable;
            this.Configuration = column.Configuration.Filter.FilterConfiguration;
            this.IsDateTime = this.Table.isDateTime(column.RawName);
        }
        FilterBase.prototype.reset = function () {
        };
        FilterBase.prototype.modifyQuery = function (query) {
            query.Filterings[this.Column.RawName] = this.getArgument();
        };
        FilterBase.prototype.getArgument = function () {
            return '';
        };
        return FilterBase;
    })(PowerTables.RenderableComponent);
    PowerTables.FilterBase = FilterBase;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=FilterBase.js.map