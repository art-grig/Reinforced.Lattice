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
        var ValueFilterPlugin = (function (_super) {
            __extends(ValueFilterPlugin, _super);
            function ValueFilterPlugin() {
                _super.apply(this, arguments);
                this._filteringIsBeingExecuted = false;
            }
            ValueFilterPlugin.prototype.getValue = function () {
                return this.FilterValueProvider.value;
            };
            ValueFilterPlugin.prototype.handleValueChanged = function () {
                var _this = this;
                if (this._filteringIsBeingExecuted)
                    return;
                if (this.getValue() === this._previousValue) {
                    return;
                }
                this._previousValue = this.getValue();
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
            ValueFilterPlugin.prototype.renderContent = function (templatesProvider) {
                return templatesProvider.getCachedTemplate('valueFilter')(this);
            };
            ValueFilterPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                if (this.Configuration.ClientFiltering) {
                    this.itIsClientFilter();
                }
                this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
            };
            ValueFilterPlugin.prototype.filterPredicate = function (rowObject, query) {
                var fval = query.Filterings[this._associatedColumn.RawName];
                if (!fval)
                    return true;
                if (this.Configuration.ClientFilteringFunction) {
                    return this.Configuration.ClientFilteringFunction(rowObject, fval, query);
                }
                if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName))
                    return true;
                var objVal = rowObject[this._associatedColumn.RawName];
                if (objVal == null)
                    return false;
                if (this._associatedColumn.IsString) {
                    var entries = fval.split(/\s/);
                    for (var i = 0; i < entries.length; i++) {
                        var e = entries[i].trim();
                        if (e.length > 0) {
                            if (objVal.indexOf(e) > -1)
                                return true;
                        }
                    }
                }
                if (this._associatedColumn.IsFloat) {
                    var f = parseFloat(fval);
                    return objVal === f;
                }
                if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                    var int = parseInt(fval);
                    return objVal === int;
                }
                if (this._associatedColumn.IsBoolean) {
                    var bv = fval.toLocaleUpperCase() === 'TRUE' ? true :
                        fval.toLocaleUpperCase() === 'FALSE' ? false : null;
                    if (bv == null) {
                        bv = parseInt(fval) > 0;
                    }
                    return objVal === bv;
                }
                return true;
            };
            ValueFilterPlugin.prototype.modifyQuery = function (query, scope) {
                var val = this.getValue();
                if (!val || val.length === 0)
                    return;
                if (this.Configuration.ClientFiltering && scope === PowerTables.QueryScope.Client || scope === PowerTables.QueryScope.Transboundary) {
                    query.Filterings[this._associatedColumn.RawName] = val;
                }
                if ((!this.Configuration.ClientFiltering) && scope === PowerTables.QueryScope.Server || scope === PowerTables.QueryScope.Transboundary) {
                    query.Filterings[this._associatedColumn.RawName] = val;
                }
            };
            return ValueFilterPlugin;
        })(Plugins.FilterBase);
        Plugins.ValueFilterPlugin = ValueFilterPlugin;
        PowerTables.ComponentsContainer.registerComponent('ValueFilter', ValueFilterPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=ValueFilterPlugin.js.map