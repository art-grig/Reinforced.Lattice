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
        var CheckboxifyPlugin = (function (_super) {
            __extends(CheckboxifyPlugin, _super);
            function CheckboxifyPlugin() {
                _super.apply(this, arguments);
                this._selectedItems = [];
                this._visibleAll = false;
                this._allSelected = false;
            }
            CheckboxifyPlugin.prototype.selectAll = function (selected) {
                var _this = this;
                if (!this._canSelectAll)
                    return;
                this._allSelected = selected == null ? !this._allSelected : selected;
                this.MasterTable.Renderer.redrawHeader(this._ourColumn);
                this._selectedItems.splice(0, this._selectedItems.length);
                if (this._allSelected) {
                    if (this.Configuration.SelectAllSelectsClientUndisplayedData) {
                        for (var i = 0; i < this.MasterTable.DataHolder.StoredData.length; i++) {
                            this._selectedItems.push(this.MasterTable.DataHolder.StoredData[i][this._valueColumnName].toString());
                        }
                        this.MasterTable.Controller.redrawVisibleData();
                    }
                    else if (this.Configuration.SelectAllSelectsServerUndisplayedData) {
                        this.MasterTable.Loader.requestServer('checkboxify_all', function (data) {
                            _this._selectedItems = data;
                            _this.MasterTable.Controller.redrawVisibleData();
                        });
                    }
                    else {
                        for (var j = 0; j < this.MasterTable.DataHolder.DisplayedData.length; j++) {
                            this._selectedItems.push(this.MasterTable.DataHolder.DisplayedData[j][this._valueColumnName].toString());
                        }
                        this.MasterTable.Controller.redrawVisibleData();
                    }
                }
                else {
                    this.MasterTable.Controller.redrawVisibleData();
                }
            };
            CheckboxifyPlugin.prototype.redrawHeader = function () {
                this.MasterTable.Renderer.redrawHeader(this._ourColumn);
            };
            CheckboxifyPlugin.prototype.createColumn = function () {
                var _this = this;
                var conf = {
                    IsDataOnly: false,
                    IsEnum: false,
                    IsNullable: false,
                    RawColumnName: '_checkboxify',
                    CellRenderingTemplateId: null,
                    CellRenderingValueFunction: null,
                    Title: 'Checkboxify',
                    ColumnType: 'Int32'
                };
                var col = {
                    Configuration: conf,
                    Header: null,
                    IsBoolean: false,
                    IsDateTime: false,
                    IsEnum: false,
                    IsFloat: false,
                    IsInteger: false,
                    IsString: false,
                    MasterTable: this.MasterTable,
                    Order: -1,
                    RawName: '_checkboxify'
                };
                var header = {
                    Column: col,
                    renderContent: null,
                    renderElement: function (tp) { return tp.getCachedTemplate('checkboxifySelectAll')({ IsAllSelected: _this._allSelected, CanSelectAll: _this._canSelectAll }); },
                    selectAllEvent: function (e) { return _this.selectAll(); }
                };
                col.Header = header;
                this.MasterTable.Renderer.ContentRenderer.cacheColumnRenderingFunction(col, function (x) {
                    var value = x.DataObject[_this._valueColumnName].toString();
                    var selected = _this._selectedItems.indexOf(value) > -1;
                    var canCheck = _this.canCheck(x.DataObject, x.Row);
                    return _this.MasterTable.Renderer.getCachedTemplate('checkboxifyCell')({ Value: value, IsChecked: selected, CanCheck: canCheck });
                });
                return col;
            };
            CheckboxifyPlugin.prototype.canCheck = function (dataObject, row) {
                return dataObject != null && !row.IsSpecial;
            };
            CheckboxifyPlugin.prototype.getSelection = function () {
                return this._selectedItems;
            };
            CheckboxifyPlugin.prototype.selectByRowIndex = function (rowIndex) {
                var displayedLookup = this.MasterTable.DataHolder.localLookupDisplayedData(rowIndex);
                var v = displayedLookup.DataObject[this._valueColumnName].toString();
                var idx = this._selectedItems.indexOf(v);
                var overrideRow = false;
                if (idx > -1) {
                    this._selectedItems.splice(idx, 1);
                }
                else {
                    this._selectedItems.push(v);
                    overrideRow = true;
                }
                var row = this.MasterTable.Controller.produceRow(displayedLookup.DataObject, displayedLookup.DisplayedIndex);
                if (overrideRow) {
                    row.renderElement = function (e) { return e.getCachedTemplate('checkboxifyRow')(row); };
                }
                this.MasterTable.Renderer.redrawRow(row);
            };
            CheckboxifyPlugin.prototype.afterLayoutRender = function () {
                var _this = this;
                this.MasterTable.Controller.subscribeCellEvent({
                    EventId: 'click',
                    Selector: '[data-checkboxify]',
                    SubscriptionId: 'checkboxify',
                    Handler: function (e) {
                        _this.selectByRowIndex(e.DisplayingRowIndex);
                    }
                });
            };
            CheckboxifyPlugin.prototype.beforeRowsRendering = function (e) {
                for (var i = 0; i < e.EventArgs.length; i++) {
                    var row = e.EventArgs[i];
                    if (row.IsSpecial)
                        continue;
                    if (this._selectedItems.indexOf(row.DataObject[this._valueColumnName].toString()) > -1) {
                        row.renderElement = function (e) { return e.getCachedTemplate('checkboxifyRow')(row); };
                    }
                }
            };
            CheckboxifyPlugin.prototype.enableSelectAll = function (enabled) {
                var prev = this._canSelectAll;
                if (!this.Configuration.EnableSelectAll)
                    this._canSelectAll = false;
                else
                    this._canSelectAll = enabled;
                if (prev !== this._canSelectAll) {
                    this.redrawHeader();
                }
            };
            CheckboxifyPlugin.prototype.onClientReload = function (e) {
                if (this.Configuration.ResetOnClientReload) {
                    this._selectedItems.splice(0, this._selectedItems.length);
                }
                if (e.EventArgs.Displaying.length === e.EventArgs.Source.length) {
                    if (this.Configuration.SelectAllOnlyIfAllData)
                        this.enableSelectAll(true);
                    else
                        this.enableSelectAll(false);
                }
            };
            CheckboxifyPlugin.prototype.onServerReload = function (e) {
                if (this.Configuration.ResetOnReload) {
                    this._selectedItems.splice(0, this._selectedItems.length);
                }
            };
            CheckboxifyPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                var col = this.createColumn();
                this.MasterTable.InstanceManager.Columns['_checkboxify'] = col;
                this._ourColumn = col;
                this._valueColumnName = this.Configuration.SelectionColumnName;
                this.MasterTable.Events.AfterLayoutRendered.subscribe(this.afterLayoutRender.bind(this), 'checkboxify');
                this.MasterTable.Events.BeforeClientRowsRendering.subscribe(this.beforeRowsRendering.bind(this), 'checkboxify');
                this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientReload.bind(this), 'checkboxify');
                this.MasterTable.Events.DataReceived.subscribe(this.onServerReload.bind(this), 'checkboxify');
            };
            CheckboxifyPlugin.prototype.modifyQuery = function (query, scope) {
                query.AdditionalData['Selection'] = this._selectedItems.join('|');
                query.AdditionalData['SelectionColumn'] = this._valueColumnName;
            };
            return CheckboxifyPlugin;
        })(Plugins.PluginBase);
        Plugins.CheckboxifyPlugin = CheckboxifyPlugin;
        PowerTables.ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=CheckboxifyPlugin.js.map