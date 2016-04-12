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
        var SelectFilterPlugin = (function (_super) {
            __extends(SelectFilterPlugin, _super);
            function SelectFilterPlugin() {
                _super.apply(this, arguments);
            }
            SelectFilterPlugin.prototype.getArgument = function () {
                return this.getSelectionArray().join('|');
            };
            SelectFilterPlugin.prototype.getSelectionArray = function () {
                if (!this.Configuration.IsMultiple) {
                    var selected = this.FilterValueProvider.options[this.FilterValueProvider.selectedIndex];
                    return [selected.value];
                }
                else {
                    var elemValues = [];
                    for (var i = 0, iLen = this.FilterValueProvider.options.length; i < iLen; i++) {
                        var opt = this.FilterValueProvider.options[i];
                        if (opt.selected) {
                            elemValues.push(opt.value);
                        }
                    }
                    return elemValues;
                }
            };
            SelectFilterPlugin.prototype.modifyQuery = function (query, scope) {
                var val = this.getArgument();
                if (!val || val.length === 0)
                    return;
                if (this.Configuration.ClientFiltering && scope === PowerTables.QueryScope.Client || scope === PowerTables.QueryScope.Transboundary) {
                    query.Filterings[this._associatedColumn.RawName] = val;
                }
                if ((!this.Configuration.ClientFiltering) && scope === PowerTables.QueryScope.Server || scope === PowerTables.QueryScope.Transboundary) {
                    query.Filterings[this._associatedColumn.RawName] = val;
                }
            };
            SelectFilterPlugin.prototype.renderContent = function (templatesProvider) {
                return templatesProvider.getCachedTemplate('selectFilter')(this);
            };
            SelectFilterPlugin.prototype.handleValueChanged = function () {
                this.MasterTable.Controller.reload();
            };
            SelectFilterPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                this._associatedColumn = this.MasterTable.InstanceManager.Columns[this.Configuration.ColumnName];
                if (this.Configuration.AllowSelectNothing) {
                    var nothingItem = { Value: '', Text: this.Configuration.NothingText || '-', Disabled: false, Selected: false };
                    this.Configuration.Items = [nothingItem].concat(this.Configuration.Items);
                }
                var sv = this.Configuration.SelectedValue;
                if (sv !== undefined && sv !== null) {
                    for (var i = 0; i < this.Configuration.Items.length; i++) {
                        if (this.Configuration.Items[i].Value !== sv) {
                            this.Configuration.Items[i].Selected = false;
                        }
                        else {
                            this.Configuration.Items[i].Selected = true;
                        }
                    }
                }
                if (this.Configuration.ClientFiltering) {
                    this.itIsClientFilter();
                }
            };
            SelectFilterPlugin.prototype.filterPredicate = function (rowObject, query) {
                var fval = query.Filterings[this._associatedColumn.RawName];
                if (!fval)
                    return true;
                var arr = fval.split('|');
                if (this.Configuration.ClientFilteringFunction) {
                    return this.Configuration.ClientFilteringFunction(rowObject, arr, query);
                }
                if (!query.Filterings.hasOwnProperty(this._associatedColumn.RawName))
                    return true;
                var objVal = rowObject[this._associatedColumn.RawName];
                if (objVal == null)
                    return false;
                if (this._associatedColumn.IsString) {
                    return arr.indexOf(objVal) >= 0;
                }
                var single = false;
                if (this._associatedColumn.IsFloat) {
                    arr.map(function (v, idx, arr) {
                        if (parseFloat(v) === objVal)
                            single = true;
                    });
                    return single;
                }
                if (this._associatedColumn.IsInteger || this._associatedColumn.IsEnum) {
                    single = false;
                    arr.map(function (v, idx, arr) {
                        if (parseInt(v) === objVal)
                            single = true;
                    });
                    return single;
                }
                if (this._associatedColumn.IsBoolean) {
                    single = false;
                    arr.map(function (v, idx, arr) {
                        var bv = v.toLocaleUpperCase() === 'TRUE' ? true :
                            v.toLocaleUpperCase() === 'FALSE' ? false : null;
                        if (bv == null) {
                            bv = parseInt(fval) > 0;
                        }
                        if (bv === objVal) {
                            single = true;
                        }
                    });
                    return single;
                }
                return true;
            };
            return SelectFilterPlugin;
        })(Plugins.FilterBase);
        Plugins.SelectFilterPlugin = SelectFilterPlugin;
        PowerTables.ComponentsContainer.registerComponent('SelectFilter', SelectFilterPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=SelectFilterPlugin.js.map