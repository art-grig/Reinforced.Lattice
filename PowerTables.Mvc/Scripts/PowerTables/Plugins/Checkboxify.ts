module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import CheckboxifyClientConfig = PowerTables.Plugins.Checkboxify.ICheckboxifyClientConfig;
    import Checkboxify = PowerTables.Plugins.Checkboxify;

    export class CheckboxifyPlugin
        extends RenderableComponent
        implements IPlugin, IQueryPartProvider {
        private _configuration: CheckboxifyClientConfig;
        private _masterTable: PowerTable;
        private _selectAllTemplate: HandlebarsTemplateDelegate;
        private _checkboxTemplate: HandlebarsTemplateDelegate;
        private _selectedItems: string[] = [];
        private _currentChecks: JQuery[] = [];
        private _selectAll: JQuery;
        private _visibleAll: boolean = false;
        constructor() {
            super(null);
            this._selectAllTemplate = Handlebars.compile($('#pt-checkboxify-all').html());
            this._checkboxTemplate = Handlebars.compile($('#pt-checkboxify-check').html());
        }

        public getSelection(): string[] {
            return this._selectedItems;
        }
        init(table: PowerTable, configuration: PluginConfiguration): void {
            this._configuration = configuration.Configuration;
            this._masterTable = table;
            table.Events.BeforeFiltersRender.subscribe(this.onFiltersRender.bind(this), 'checkboxify');
            table.Events.BeforeRowDraw.subscribe(this.onRowRender.bind(this), 'checkboxify');
            table.Events.BeforeColumnsRender.subscribe(this.onColumnsRender.bind(this), 'checkboxify');
            table.Events.BeforeResponseDrawing.subscribe(this.onBeforeResponse.bind(this), 'checkboxify');
            table.Events.ResponseDrawing.subscribe(this.onAfterRespons.bind(this), 'checkboxify');
        }
        checkVisibleAll(response: IPowerTablesResponse) {
            var currentData = response.Data.length / this._masterTable.Configuration.RawColumnNames.length;
            if (currentData < response.ResultsCount) this._visibleAll = false;
            else this._visibleAll = true;
        }
        onBeforeResponse(response: IPowerTablesResponse) {
            this.checkVisibleAll(response);
            if (this._configuration.SelectAllOnlyIfAllData) {
                if (!this._visibleAll) this._selectAll.hide();
                else this._selectAll.show();
            }
            if (this._configuration.ResetOnReload) {
                this._selectedItems.splice(0, this._selectedItems.length);
                this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
            }
            this._currentChecks.splice(0, this._currentChecks.length);
            if (this._configuration.EnableSelectAll) this._selectAll.prop('checked', false);
        }
        onAfterRespons(response: IPowerTablesResponse) {
            if (!this._configuration.EnableSelectAll) return;
            var checkedAll = true;
            for (var i = 0; i < this._currentChecks.length; i++) {
                if (!this._currentChecks[i].is(':checked')) {
                    return;
                }
            }
            this._selectAll.prop('checked', true);
        }
        onColumnsRender() {
            var _self = this;
            var col = null;
            if (this._configuration.CheckboxifyColumnName) {
                col = this._masterTable.Renderer.renderColumnHeader(<any>{ Configuration: { Title: this._configuration.CheckboxifyColumnName } });
            } else {
                col = this._masterTable.Renderer.renderRawColumnHeader('');
            }

            if (this._configuration.EnableSelectAll && this._configuration.SelectAllLocation == Checkboxify.SelectAllLocation.ColumnHeader) {
                var template = this._selectAllTemplate({ NeedsColumn: false });
                var selectAll = $(template);

                var item = selectAll.find('input[data-target="checkboxify"]').andSelf().filter('input[data-target="checkboxify"]');
                this._selectAll = item;
                item.change(function () {
                    _self.selectAll($(this).is(':checked'));
                });
                col.append(selectAll);
            }
        }

        onFiltersRender() {
            var _self = this;
            if (this._configuration.EnableSelectAll && this._configuration.SelectAllLocation == Checkboxify.SelectAllLocation.FiltersHeader) {
                var selectAll = $(this._selectAllTemplate({ NeedsColumn: true }));
                var item = selectAll.find('input[data-target="checkboxify"]').andSelf().filter('input[data-target="checkboxify"]');
                this._selectAll = item;
                item.change(function () {
                    _self.selectAll($(this).is(':checked'));
                });
                this._masterTable.Renderer.Filters.append(selectAll);
            }
            else {
                this._masterTable.Renderer.renderEmptyFilter();
            }
        }

        onRowRender(r: PowerTables.IRow) {
            if (r.Fake) {
                r.Element.append(this._masterTable.Renderer.renderRawCell(''));
                return;
            }
            var data = r.DataObject[this._configuration.SelectionColumnName];
            if (data !== undefined && data !== null) data = data.toString();
            var selected = this._selectedItems.indexOf(data) !== -1;

            if (this._configuration.SelectedRowClass) {
                if (selected) {
                    r.Element.addClass(this._configuration.SelectedRowClass);
                } else {
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
                    } else {
                        r.Element.removeClass(_self._configuration.SelectedRowClass);
                    }
                }
            });
            r.Element.append(elem);
        }

        public resetSelection() {
            this.selectAll(false);
        }

        public selectAll(selected: boolean) {
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
            } else {
                for (var j = 0; j < this._currentChecks.length; j++) {
                    this._currentChecks[j].prop('checked', false);
                    this._currentChecks[j].trigger('change');
                }
                if (this._configuration.SelectAllSelectsUndisplayedData) {
                    this._selectedItems.splice(0, this._selectedItems.length);
                    this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
                }
            }
        }

        public selectItem(itemId: string, selected: boolean) {
            itemId = itemId.toString();
            var idx = this._selectedItems.indexOf(itemId);
            if (selected) {
                if (idx === -1) {
                    this._selectedItems.push(itemId);
                    this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
                }
            } else {
                if (idx !== -1) {
                    this._selectedItems.splice(idx, 1);
                    this._masterTable.Events.SelectionChanged.invoke(this, [this._selectedItems]);
                }
            }
        }

        IsToolbarPlugin: boolean = false;
        PluginId: string = 'Checkboxify';
        IsRenderable: boolean = false;


        IsQueryModifier: boolean = true;

        modifyQuery(query: PowerTables.IQuery): void {
            query.AdditionalData['Selection'] = this._selectedItems.join('|');
            query.AdditionalData['SelectionColumn'] = this._configuration.SelectionColumnName;
        }
    }

    PowerTables.ComponentsContainer.registerComponent('Checkboxify', PowerTables.CheckboxifyPlugin);
}  