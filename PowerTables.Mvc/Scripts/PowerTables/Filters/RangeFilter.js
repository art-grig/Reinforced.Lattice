var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var RangeFilter = (function (_super) {
        __extends(RangeFilter, _super);
        function RangeFilter(column) {
            _super.call(this, 'pt-rangefilter', column);
            this._filteringIsBeingExecuted = false;
        }
        RangeFilter.prototype.subscribeEvents = function (parentElement) {
            var _self = this;
            this._fromElement = parentElement.find("input[data-for='" + this.Column.RawName + "'][data-rng='from']");
            this._toElement = parentElement.find("input[data-for='" + this.Column.RawName + "'][data-rng='to']");
            if (this.IsDateTime) {
                this.Table.Renderer.createDatepicker(this._fromElement);
                this.Table.Renderer.createDatepicker(this._toElement);
            }
            this._fromElement.keyup(function (e) {
                _self.handleValueChanged();
            });
            this._toElement.keyup(function (e) {
                _self.handleValueChanged();
            });
            this._fromElement.change(function (e) {
                $(this).trigger('keyup', e);
            });
            this._toElement.change(function (e) {
                $(this).trigger('keyup', e);
            });
        };
        RangeFilter.prototype.handleValueChanged = function () {
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
        RangeFilter.prototype.getArgument = function () {
            var args = [];
            if (this._fromElement) {
                var v = this._fromElement.val();
                args.push(v);
            }
            if (this._toElement) {
                var v2 = this._toElement.val();
                args.push(v2);
            }
            var result = args.join('|');
            return result;
        };
        RangeFilter.prototype.reset = function () {
            if (this._fromElement) {
                this._fromElement.val('');
            }
            if (this._toElement) {
                this._toElement.val('');
            }
        };
        return RangeFilter;
    })(PowerTables.FilterBase);
    PowerTables.RangeFilter = RangeFilter;
    PowerTables.ComponentsContainer.registerComponent('RangeFilter', RangeFilter);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=RangeFilter.js.map