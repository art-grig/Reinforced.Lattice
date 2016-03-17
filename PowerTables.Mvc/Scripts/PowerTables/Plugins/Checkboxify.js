var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var CheckboxifyPlugin = (function (_super) {
        __extends(CheckboxifyPlugin, _super);
        function CheckboxifyPlugin() {
            _super.call(this, null);
            this._selectedItems = [];
            this._currentChecks = [];
            this._visibleAll = false;
            this.IsToolbarPlugin = false;
            this.PluginId = 'Checkboxify';
            this.IsRenderable = false;
            this.IsQueryModifier = true;
            this._selectAllTemplate = Handlebars.compile($('#pt-checkboxify-all').html());
            this._checkboxTemplate = Handlebars.compile($('#pt-checkboxify-check').html());
        }
        CheckboxifyPlugin.prototype.init = function (table, configuration) {
            this._configuration = configuration.Configuration;
            this._masterTable = table;
            table.Events.BeforeFiltersRender.subscribe(this.onFiltersRender.bind(this), 'checkboxify');
            table.Events.BeforeRowDraw.subscribe(this.onRowRender.bind(this), 'checkboxify');
            table.Events.BeforeColumnsRender.subscribe(this.onColumnsRender.bind(this), 'checkboxify');
            table.Events.BeforeResponseDrawing.subscribe(this.onBeforeResponse.bind(this), 'checkboxify');
            table.Events.ResponseDrawing.subscribe(this.onAfterRespons.bind(this), 'checkboxify');
        };
        CheckboxifyPlugin.prototype.checkVisibleAll = function (response) {
            var currentData = response.Data.length / this._masterTable.Configuration.RawColumnNames.length;
            if (currentData < response.ResultsCount)
                this._visibleAll = false;
            else
                this._visibleAll = true;
        };
        CheckboxifyPlugin.prototype.onBeforeResponse = function (response) {
            this.checkVisibleAll(response);
            if (this._configuration.SelectAllOnlyIfAllData) {
                if (!this._visibleAll)
                    this._selectAll.hide();
                else
                    this._selectAll.show();
            }
            if (this._configuration.ResetOnReload) {
                this._selectedItems.splice(0, this._selectedItems.length);
            }
            this._currentChecks.splice(0, this._currentChecks.length);
            if (this._configuration.EnableSelectAll)
                this._selectAll.prop('checked', false);
        };
        CheckboxifyPlugin.prototype.onAfterRespons = function (response) {
            if (!this._configuration.EnableSelectAll)
                return;
            var checkedAll = true;
            for (var i = 0; i < this._currentChecks.length; i++) {
                if (!this._currentChecks[i].is(':checked')) {
                    return;
                }
            }
            this._selectAll.prop('checked', true);
        };
        CheckboxifyPlugin.prototype.onColumnsRender = function () {
            if (this._configuration.CheckboxifyColumnName) {
                this._masterTable.Renderer.renderColumnHeader({ Configuration: { Title: this._configuration.CheckboxifyColumnName } });
            }
            else {
                this._masterTable.Renderer.renderRawColumnHeader('');
            }
        };
        CheckboxifyPlugin.prototype.onFiltersRender = function () {
            var _self = this;
            if (this._configuration.EnableSelectAll) {
                var selectAll = $(this._selectAllTemplate(null));
                var item = selectAll.find('input[data-target="checkboxify"]');
                this._selectAll = item;
                item.change(function () {
                    _self.selectAll($(this).is(':checked'));
                });
                this._masterTable.Renderer.Filters.append(selectAll);
            }
            else {
                this._masterTable.Renderer.renderEmptyFilter();
            }
        };
        CheckboxifyPlugin.prototype.onRowRender = function (r) {
            if (r.Fake) {
                r.Element.append(this._masterTable.Renderer.renderRawCell(''));
                return;
            }
            var data = r.DataObject[this._configuration.SelectionColumnName];
            if (data !== undefined && data !== null)
                data = data.toString();
            var selected = this._selectedItems.indexOf(data) !== -1;
            if (this._configuration.SelectedRowClass) {
                if (selected) {
                    r.Element.addClass(this._configuration.SelectedRowClass);
                }
                else {
                    r.Element.removeClass(this._configuration.SelectedRowClass);
                }
            }
            var elem = $(this._checkboxTemplate({ Value: data, Checked: selected }));
            var _self = this;
            var check = elem.find('[data-target="checkboxify"]');
            this._currentChecks.push(check);
            check.change(function () {
                _self.selectItem(data, $(this).is(':checked'));
                if (_self._configuration.SelectedRowClass) {
                    if ($(this).is(':checked')) {
                        r.Element.addClass(_self._configuration.SelectedRowClass);
                    }
                    else {
                        r.Element.removeClass(_self._configuration.SelectedRowClass);
                    }
                }
            });
            r.Element.append(elem);
        };
        CheckboxifyPlugin.prototype.resetSelection = function () {
            this.selectAll(false);
        };
        CheckboxifyPlugin.prototype.selectAll = function (selected) {
            if (selected) {
                for (var i = 0; i < this._currentChecks.length; i++) {
                    this._currentChecks[i].prop('checked', true);
                    this._currentChecks[i].trigger('change');
                }
                if (this._configuration.SelectAllSelectsUndisplayedData && !this._visibleAll) {
                    var _self = this;
                    this._masterTable.requestServer('checkboxify_all', function (data) {
                        _self._selectedItems = data;
                        _self._masterTable.Events.SelectionChanged.invoke(_self, [_self._selectedItems]);
                    });
                }
            }
            else {
                for (var j = 0; j < this._currentChecks.length; j++) {
                    this._currentChecks[j].prop('checked', false);
                    this._currentChecks[j].trigger('change');
                }
                if (this._configuration.SelectAllSelectsUndisplayedData) {
                    this._selectedItems.splice(0, this._selectedItems.length);
                    this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
                }
            }
        };
        CheckboxifyPlugin.prototype.selectItem = function (item, selected) {
            item = item.toString();
            var idx = this._selectedItems.indexOf(item);
            if (selected) {
                if (idx === -1) {
                    this._selectedItems.push(item);
                    this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
                }
            }
            else {
                if (idx !== -1) {
                    this._selectedItems.splice(idx, 1);
                    this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
                }
            }
        };
        CheckboxifyPlugin.prototype.modifyQuery = function (query) {
            query.AdditionalData['Selection'] = this._selectedItems.join('|');
            query.AdditionalData['SelectionColumn'] = this._configuration.SelectionColumnName;
        };
        return CheckboxifyPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.CheckboxifyPlugin = CheckboxifyPlugin;
    PowerTables.ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Checkboxify.js.map