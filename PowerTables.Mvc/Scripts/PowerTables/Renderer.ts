module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import ColumnConfiguration = PowerTables.Configuration.Json.IColumnConfiguration;

    export class Renderer {
        constructor(rootId: string) {
            this._rootId = rootId;
            this._noData = Handlebars.compile($('#pt-noresults').html());
            this.ColumnsRenderFunctions = {};
        }

        private _rootId: string;
        public ColumnsRenderFunctions: { [key: string]: (x: ICell) => JQuery }
        public LayoutRoot: JQuery;
        public TablePlaceholder: JQuery;

        public PluginsLT: JQuery;
        public PluginsLB: JQuery;
        public PluginsRT: JQuery;
        public PluginsRB: JQuery;

        public PluginsLT_Toolbar: JQuery;
        public PluginsLB_Toolbar: JQuery;
        public PluginsRT_Toolbar: JQuery;
        public PluginsRB_Toolbar: JQuery;

        public Table: JQuery;
        public Headers: JQuery;
        public Filters: JQuery;
        public Body: JQuery;
        private _noData: HandlebarsTemplateDelegate;
        private _columnHeader: HandlebarsTemplateDelegate;
        private _rawColumnHeader: HandlebarsTemplateDelegate;
        private _emptyFilter: HandlebarsTemplateDelegate;
        private _error: HandlebarsTemplateDelegate;
        private _loading: HandlebarsTemplateDelegate;
        private _rawCell: HandlebarsTemplateDelegate;
        private _pluginPlaceholder: HandlebarsTemplateDelegate;
        private _row: HandlebarsTemplateDelegate;

        public hideFilters(): void {
            this.Filters.hide();
        }
        public showFilters(): void {
            this.Filters.show();
        }
        public toggleFilters(): void {
            this.Filters.toggle();
        }
        public renderColumnHeader(column: IColumn): JQuery {
            var header = $(this._columnHeader(column));
            this.Headers.append(header);
            return header;
        }

        public renderRawColumnHeader(rawContent: string): JQuery {
            var header = $(this._rawColumnHeader(rawContent));
            this.Headers.append(header);
            return header;
        }

        public renderEmptyFilter(): JQuery {
            var header = $(this._emptyFilter(null));
            this.Filters.append(header);
            return header;
        }
        public showError(errorText: string) {
            this.clearTableResults();
            if (errorText) {
                errorText = errorText.replace(/</, '&lt;').replace(/>/, '&gt;').replace(/[\r\n]+/g, '<br/>');
            }
            var columns = this.Headers.find('th:visible').length;
            this.Body.append(this._error({ Columns: columns, ErrorText: errorText }));
        }

        public showLoading() {
            this.clearTableResults();
            var columns = this.Headers.find('th:visible').length;
            this.Body.append(this._loading({ Columns: columns }));
        }

        public renderRawCell(rawContent: string): JQuery {
            return $(this._rawCell(rawContent));
        }

        public createDatepicker: (element: JQuery) => void;

        public renderRow(index:number) : JQuery {
            return $(this._row(index));
        }


        public layout(): void {
            this.TablePlaceholder = $('#' + this._rootId);
            this._columnHeader = Handlebars.compile($('#pt-columnheader').html());
            this._rawColumnHeader = Handlebars.compile($('#pt-rawcolumnheader').html());
            this._emptyFilter = Handlebars.compile($('#pt-emptyfilter').html());
            this._error = Handlebars.compile($('#pt-error').html());
            this._loading = Handlebars.compile($('#pt-loading').html());
            this._rawCell = Handlebars.compile($('#pt-rawcell').html());
            this._pluginPlaceholder = Handlebars.compile($('#pt-pluginPlaceholder').html());
            this._row = Handlebars.compile($('#pt-row').html());

            var layouttemplate = Handlebars.compile($('#pt-layout').html());
            this.TablePlaceholder.html(layouttemplate(null));
            this.LayoutRoot = this.TablePlaceholder.first();

            this.PluginsLT = this.LayoutRoot.find('[data-placeholder=\'ltPlugins\']');
            this.PluginsLT_Toolbar = this.LayoutRoot.find('[data-placeholder=\'ltPlugins_toolbar\']');
            this.PluginsLB = this.LayoutRoot.find('[data-placeholder=\'lbPlugins\']');
            this.PluginsLB_Toolbar = this.LayoutRoot.find('[data-placeholder=\'lbPlugins_toolbar\']');
            this.PluginsRT = this.LayoutRoot.find('[data-placeholder=\'rtPlugins\']');
            this.PluginsRT_Toolbar = this.LayoutRoot.find('[data-placeholder=\'rtPlugins_toolbar\']');
            this.PluginsRB = this.LayoutRoot.find('[data-placeholder=\'rbPlugins\']');
            this.PluginsRB_Toolbar = this.LayoutRoot.find('[data-placeholder=\'rbPlugins_toolbar\']');


            this.Headers = this.LayoutRoot.find('[data-placeholder=\'headers\']');
            this.Table = this.LayoutRoot.find('[data-placeholder=\'tableItself\']');
            this.Filters = this.LayoutRoot.find('[data-placeholder=\'filters\']');
            this.Body = this.LayoutRoot.find('[data-placeholder=\'body\']');
        }

        public getPluginsPlaceholder(placeholder: string): JQuery {
            switch (placeholder) {
                case 'lt':
                    return this.PluginsLT;
                case 'lb':
                    return this.PluginsLB;
                case 'rt':
                    return this.PluginsRT;
                case 'rb':
                    return this.PluginsRB;
            }
            return null;
        }

        public getToolbarPlaceholder(placeholder: string): JQuery {
            switch (placeholder) {
                case 'lt':
                    return this.PluginsLT_Toolbar;
                case 'lb':
                    return this.PluginsLB_Toolbar;
                case 'rt':
                    return this.PluginsRT_Toolbar;
                case 'rb':
                    return this.PluginsRB_Toolbar;
            }
            return null;
        }

        public clearTableResults(): void {
            this.Body.empty();
        }

        public renderNoData(): void {
            var columns = this.Headers.find('th:visible').length;
            this.Body.append(this._noData({ Columns: columns }));
        }

        public appendRow(rowElement: JQuery): void {
            this.Body.append(rowElement);
        }

        public renderPlugin(plugin: IPlugin, configuration: PluginConfiguration) {
            if (!plugin.IsRenderable) return;
            var holder = null;
            if (plugin.IsToolbarPlugin) {
                holder = this.getToolbarPlaceholder(configuration.Placement);
            } else {
                holder = this.getPluginsPlaceholder(configuration.Placement);
            }
            
            if (!plugin.IsToolbarPlugin) {
                var p = {};
                p[configuration.Placement] = true;
                var place = $(this._pluginPlaceholder(p)).attr('data-plugin', plugin.PluginId);
                holder.append(place);
                plugin.renderTo(place);
            } else {
                plugin.renderTo(holder);
            }

            
        }

        public renderCell(cell: ICell): JQuery {
            return this.ColumnsRenderFunctions[cell.Column.RawName](cell);
        }

        public cacheCellsRenderFunctions(columns: ColumnConfiguration[], defaultCellElement: string): void {

            for (var i = 0; i < columns.length; i++) {
                var columnConfig = columns[i];
                if (columnConfig.CellRenderingValueFunction) {
                    this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                    (x: ICell) => {
                        var text = x.Column.Configuration.CellRenderingValueFunction(x.DataObject);
                        return $(`<${defaultCellElement}>${text}</${defaultCellElement}>`);
                    };

                    continue;
                }

                if (columnConfig.CellRenderingHtmlFunction) {
                    this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                    (x: ICell) => $(x.Column.Configuration.CellRenderingHtmlFunction(x.DataObject));

                    continue;
                }

                if (columnConfig.CellRenderingTemplateId) {
                    var compiled = Handlebars.compile($(`#${columnConfig.CellRenderingTemplateId}`).html());
                    this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                    (compl => (x: ICell) => $(compl(x.DataObject)))(compiled);

                    continue;
                }
                this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                (x: ICell) => $(`<${defaultCellElement}>${((x.Data !== null && x.Data !== undefined) ? x.Data : '') }</${defaultCellElement}>`);
            };

        }
    }
}
 