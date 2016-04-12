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
        var Ordering;
        (function (Ordering) {
            var OrderingPlugin = (function (_super) {
                __extends(OrderingPlugin, _super);
                function OrderingPlugin() {
                    _super.apply(this, arguments);
                    this._clientOrderings = {};
                    this._serverOrderings = {};
                }
                OrderingPlugin.prototype.subscribe = function (e) {
                    var _this = this;
                    e.ColumnsCreation.subscribe(function (v) {
                        _this.overrideHeadersTemplates(v.EventArgs);
                    }, 'ordering');
                };
                OrderingPlugin.prototype.overrideHeadersTemplates = function (columns) {
                    var _this = this;
                    var handler = function (e) {
                        _this.switchOrderingForColumn(e.Receiver.Column.RawName);
                    };
                    for (var ck in columns) {
                        if (columns.hasOwnProperty(ck)) {
                            var ordering = this.Configuration.DefaultOrderingsForColumns[ck];
                            if (!ordering)
                                continue;
                            var newHeader = {
                                Column: columns[ck],
                                switchOrdering: handler,
                                IsClientOrdering: this.isClient(ck)
                            };
                            this.updateOrdering(ck, ordering);
                            (function (hdr) {
                                hdr.renderElement = function (tp) {
                                    return tp.getCachedTemplate('ordering')(hdr);
                                };
                            })(newHeader);
                            this.specifyOrdering(newHeader, ordering);
                            columns[ck].Header = newHeader;
                        }
                    }
                };
                OrderingPlugin.prototype.updateOrdering = function (columnName, ordering) {
                    if (this.isClient(columnName))
                        this._clientOrderings[columnName] = ordering;
                    else
                        this._serverOrderings[columnName] = ordering;
                };
                OrderingPlugin.prototype.specifyOrdering = function (object, ordering) {
                    object.IsNeutral = object.IsDescending = object.IsAscending = false;
                    switch (ordering) {
                        case PowerTables.Ordering.Neutral:
                            object.IsNeutral = true;
                            break;
                        case PowerTables.Ordering.Descending:
                            object.IsDescending = true;
                            break;
                        case PowerTables.Ordering.Ascending:
                            object.IsAscending = true;
                            break;
                    }
                };
                OrderingPlugin.prototype.isClient = function (columnName) {
                    return this.Configuration.ClientSortableColumns.hasOwnProperty(columnName);
                };
                OrderingPlugin.prototype.switchOrderingForColumn = function (columnName) {
                    if (!this.Configuration.DefaultOrderingsForColumns[columnName])
                        throw new Error("Ordering is not configured for column " + columnName);
                    var coolHeader = this.MasterTable.InstanceManager.Columns[columnName].Header;
                    var orderingsCollection = this.isClient(columnName) ? this._clientOrderings : this._serverOrderings;
                    var next = this.nextOrdering(orderingsCollection[columnName]);
                    this.specifyOrdering(coolHeader, next);
                    this.updateOrdering(columnName, next);
                    this.MasterTable.Renderer.redrawHeader(coolHeader.Column);
                    this.MasterTable.Controller.reload();
                };
                OrderingPlugin.prototype.nextOrdering = function (currentOrdering) {
                    switch (currentOrdering) {
                        case PowerTables.Ordering.Neutral: return PowerTables.Ordering.Ascending;
                        case PowerTables.Ordering.Descending: return PowerTables.Ordering.Neutral;
                        case PowerTables.Ordering.Ascending: return PowerTables.Ordering.Descending;
                    }
                };
                OrderingPlugin.prototype.makeDefaultOrderingFunction = function (fieldName) {
                    var self = this;
                    return (function (field) {
                        return function (a, b) {
                            var x = a[field], y = b[field];
                            if (x === y)
                                return 0;
                            if (x == null || x == undefined)
                                return -1;
                            if (y == null || y == undefined)
                                return 1;
                            if (typeof x === "string") {
                                return x.localeCompare(y);
                            }
                            return (x > y) ? 1 : -1;
                        };
                    })(fieldName);
                };
                OrderingPlugin.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    var hasClientOrderings = false;
                    var fn;
                    for (var cls in this.Configuration.ClientSortableColumns) {
                        if (this.Configuration.ClientSortableColumns.hasOwnProperty(cls)) {
                            hasClientOrderings = true;
                            fn = this.Configuration.ClientSortableColumns[cls];
                            if (!fn) {
                                fn = this.makeDefaultOrderingFunction(cls);
                                this.Configuration.ClientSortableColumns[cls] = fn;
                            }
                            this.MasterTable.DataHolder.registerClientOrdering(cls, fn);
                        }
                    }
                    if (hasClientOrderings) {
                        // if we have at least 1 client ordering then we have to reorder whole 
                        // received data on client
                        // to avoid client ordering priority
                        for (var serverColumn in this.Configuration.DefaultOrderingsForColumns) {
                            if (this.isClient(serverColumn))
                                continue;
                            fn = this.makeDefaultOrderingFunction(serverColumn);
                            this.MasterTable.DataHolder.registerClientOrdering(serverColumn, fn);
                        }
                    }
                };
                OrderingPlugin.prototype.mixinOrderings = function (orderingsCollection, query) {
                    for (var clo in orderingsCollection) {
                        if (orderingsCollection.hasOwnProperty(clo)) {
                            query.Orderings[clo] = orderingsCollection[clo];
                        }
                    }
                };
                OrderingPlugin.prototype.modifyQuery = function (query, scope) {
                    this.mixinOrderings(this._serverOrderings, query);
                    if (scope === PowerTables.QueryScope.Client || scope === PowerTables.QueryScope.Transboundary) {
                        this.mixinOrderings(this._clientOrderings, query);
                    }
                };
                return OrderingPlugin;
            })(Plugins.FilterBase);
            Ordering.OrderingPlugin = OrderingPlugin;
            PowerTables.ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
        })(Ordering = Plugins.Ordering || (Plugins.Ordering = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Ordering.js.map