var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var ValueFilter = (function (_super) {
        __extends(ValueFilter, _super);
        function ValueFilter(column) {
            _super.call(this, 'pt-valuefilter', column);
            this._filteringIsBeingExecuted = false;
        }
        ValueFilter.prototype.subscribeEvents = function (parentElement) {
            var _self = this;
            this._inputElement = parentElement.find("input[data-for='" + this.Column.RawName + "']");
            if (this.IsDateTime)
                this.Table.Renderer.createDatepicker(this._inputElement);
            this._inputElement.keyup(function (e) {
                _self.handleValueChanged();
            });
            this._inputElement.change(function (e) {
                $(this).trigger('keyup', e);
            });
        };
        ValueFilter.prototype.handleValueChanged = function () {
            var _this = this;
            if (this._filteringIsBeingExecuted)
                return;
            this._filteringIsBeingExecuted = true;
            if (this.Configuration.InputDelay > 0) {
                setTimeout(function () {
                    _this.Table.reload();
                    _this._filteringIsBeingExecuted = false;
                }, this.Configuration.InputDelay);
            }
            else {
                this.Table.reload();
                this._filteringIsBeingExecuted = false;
            }
        };
        ValueFilter.prototype.getArgument = function () {
            if (this._inputElement) {
                var v = this._inputElement.val();
                return v;
            }
            return '';
        };
        ValueFilter.prototype.reset = function () {
            if (this._inputElement) {
                this._inputElement.val('');
            }
        };
        return ValueFilter;
    })(PowerTables.FilterBase);
    PowerTables.ValueFilter = ValueFilter;
    PowerTables.ComponentsContainer.registerComponent('ValueFilter', ValueFilter);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=ValueFilter.js.map