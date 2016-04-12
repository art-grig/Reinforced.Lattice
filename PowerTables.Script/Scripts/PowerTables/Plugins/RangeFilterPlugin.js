var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        var RangeFilterPlugin = (function (_super) {
            __extends(RangeFilterPlugin, _super);
            function RangeFilterPlugin() {
                _super.apply(this, arguments);
                this._filteringIsBeingExecuted = false;
            }
            RangeFilterPlugin.prototype.getFromValue = function () {
                return this.FromValueProvider.value;
            };
            RangeFilterPlugin.prototype.getToValue = function () {
                return this.ToValueProvider.value;
            };
            RangeFilterPlugin.prototype.handleValueChanged = function () {
                var _this = this;
                if (this._filteringIsBeingExecuted)
                    return;
                if ((this._fromPreviousValue === this.getFromValue())
                    && (this._toPreviousValue === this.getToValue()))
                    return;
                this._fromPreviousValue = this.getFromValue();
                this._toPreviousValue = this.getToValue();
                if (this.Configuration.InputDelay > 0) {
                    clearTimeout(this._inpTimeout);
                    this._inpTimeout = setTimeout(function () {
                        _this._filteringIsBeingExecuted = true;
                        _this.MasterTable.Controller.reload();
                        _this._filteringIsBeingExecuted = false;
                    }, this.Configuration.InputDelay);
                }
                else {
                    this._filteringIsBeingExecuted = true;
                    this.MasterTable.Controller.reload();
                    this._filteringIsBeingExecuted = false;
                }
            };
            RangeFilterPlugin.prototype.getFilterArgument = function () {
                var args = [];
                var frm = this.getFromValue();
                var to = this.getToValue();
                args.push(frm);
                args.push(to);
                var result = args.join('|');
                return result;
            };
            RangeFilterPlugin.prototype.modifyQuery = function (query, scope) {
                var val = this.getFilterArgument();
                if (!val || val.length === 0)
                    return;
                if (this.Configuration.ClientFiltering && scope === PowerTables.QueryScope.Client || scope === PowerTables.QueryScope.Transboundary) {
                    query.Filterings[this._associatedColumn.RawName] = val;
                }
                if ((!this.Configuration.ClientFiltering) && scope === PowerTables.QueryScope.Server || scope === PowerTables.QueryScope.Transboundary) {
                    query.Filterings[this._associatedColumn.RawName] = val;
                }
            };
            RangeFilterPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                if (this.Configuration.ClientFiltering) {
                    this.itIsClientFilter();
                }
                this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
            };
            RangeFilterPlugin.prototype.renderContent = function (templatesProvider) {
                return templatesProvider.getCachedTemplate('rangeFilter')(this);
            };
            RangeFilterPlugin.prototype.filterPredicate = function (rowObject, query) {
                var fval = query.Filterings[this._associatedColumn.RawName];
                if (!fval)
                    return true;
                var args = fval.split('|');
                var fromValue = args[0];
                var toValue = args[1];
                if (this.Configuration.ClientFilteringFunction) {
                    return this.Configuration.ClientFilteringFunction(rowObject, fromValue, toValue, query);
                }
                var frmEmpty = fromValue.trim().length === 0;
                var toEmpty = toValue.trim().length === 0;
                if (frmEmpty && toEmpty)
                    return true;
                if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName))
                    return true;
                var objVal = rowObject[this._associatedColumn.RawName];
                if (objVal == null)
                    return false;
                if (this._associatedColumn.IsString) {
                    var str = objVal.toString();
                    return ((frmEmpty) || str.localeCompare(fromValue) >= 0) && ((toEmpty) || str.localeCompare(toValue) <= 0);
                }
                if (this._associatedColumn.IsFloat) {
                    return ((frmEmpty) || objVal >= parseFloat(fromValue)) && ((toEmpty) || objVal <= parseFloat(toValue));
                }
                if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                    return ((frmEmpty) || objVal >= parseInt(fromValue)) && ((toEmpty) || objVal <= parseInt(toValue));
                }
                return true;
            };
            return RangeFilterPlugin;
        })(Plugins.FilterBase);
        Plugins.RangeFilterPlugin = RangeFilterPlugin;
        PowerTables.ComponentsContainer.registerComponent('RangeFilter', RangeFilterPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=RangeFilterPlugin.js.map