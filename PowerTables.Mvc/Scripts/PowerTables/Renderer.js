var PowerTables;
(function (PowerTables) {
    var Renderer = (function () {
        function Renderer(rootId) {
            this._rootId = rootId;
            this._noData = Handlebars.compile($('#pt-noresults').html());
            this.ColumnsRenderFunctions = {};
        }
        Renderer.prototype.hideFilters = function () {
            this.Filters.hide();
        };
        Renderer.prototype.showFilters = function () {
            this.Filters.show();
        };
        Renderer.prototype.toggleFilters = function () {
            this.Filters.toggle();
        };
        Renderer.prototype.renderColumnHeader = function (column) {
            var header = $(this._columnHeader(column));
            this.Headers.append(header);
            return header;
        };
        Renderer.prototype.renderRawColumnHeader = function (rawContent) {
            var header = $(this._rawColumnHeader(rawContent));
            this.Headers.append(header);
            return header;
        };
        Renderer.prototype.renderEmptyFilter = function () {
            var header = $(this._emptyFilter(null));
            this.Filters.append(header);
            return header;
        };
        Renderer.prototype.showError = function (errorText) {
            this.clearTableResults();
            if (errorText) {
                errorText = errorText.replace(/</, '&lt;').replace(/>/, '&gt;').replace(/[\r\n]+/g, '<br/>');
            }
            var columns = this.Headers.find('th:visible').length;
            this.Body.append(this._error({ Columns: columns, ErrorText: errorText }));
        };
        Renderer.prototype.showLoading = function () {
            this.clearTableResults();
            var columns = this.Headers.find('th:visible').length;
            this.Body.append(this._loading({ Columns: columns }));
        };
        Renderer.prototype.renderRawCell = function (rawContent) {
            return $(this._rawCell(rawContent));
        };
        Renderer.prototype.layout = function () {
            this.TablePlaceholder = $('#' + this._rootId);
            this._columnHeader = Handlebars.compile($('#pt-columnheader').html());
            this._rawColumnHeader = Handlebars.compile($('#pt-rawcolumnheader').html());
            this._emptyFilter = Handlebars.compile($('#pt-emptyfilter').html());
            this._error = Handlebars.compile($('#pt-error').html());
            this._loading = Handlebars.compile($('#pt-loading').html());
            this._rawCell = Handlebars.compile($('#pt-rawcell').html());
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
        };
        Renderer.prototype.getPluginsPlaceholder = function (placeholder) {
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
        };
        Renderer.prototype.getToolbarPlaceholder = function (placeholder) {
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
        };
        Renderer.prototype.clearTableResults = function () {
            this.Body.empty();
        };
        Renderer.prototype.renderNoData = function () {
            var columns = this.Headers.find('th:visible').length;
            this.Body.append(this._noData({ Columns: columns }));
        };
        Renderer.prototype.appendRow = function (rowElement) {
            this.Body.append(rowElement);
        };
        Renderer.prototype.renderPlugin = function (plugin, configuration) {
            if (!plugin.IsRenderable)
                return;
            var holder = null;
            if (plugin.IsToolbarPlugin) {
                holder = this.getToolbarPlaceholder(configuration.Placement);
            }
            else {
                holder = this.getPluginsPlaceholder(configuration.Placement);
            }
            if (!plugin.IsToolbarPlugin) {
                var place = $('<div></div>').addClass('_' + plugin.PluginId);
                if (configuration.Placement === 'lt' || configuration.Placement === 'lb') {
                    place.css('float', 'left');
                }
                if (configuration.Placement === 'rt' || configuration.Placement === 'rb') {
                    place.css('float', 'right');
                }
                holder.append(place);
                plugin.renderTo(place);
            }
            else {
                plugin.renderTo(holder);
            }
        };
        Renderer.prototype.renderCell = function (cell) {
            return this.ColumnsRenderFunctions[cell.Column.RawName](cell);
        };
        Renderer.prototype.cacheCellsRenderFunctions = function (columns, defaultCellElement) {
            for (var i = 0; i < columns.length; i++) {
                var columnConfig = columns[i];
                if (columnConfig.CellRenderingValueFunction) {
                    this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                        function (x) {
                            var text = x.Column.Configuration.CellRenderingValueFunction(x.DataObject);
                            return $("<" + defaultCellElement + ">" + text + "</" + defaultCellElement + ">");
                        };
                    continue;
                }
                if (columnConfig.CellRenderingHtmlFunction) {
                    this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                        function (x) { return $(x.Column.Configuration.CellRenderingHtmlFunction(x.DataObject)); };
                    continue;
                }
                if (columnConfig.CellRenderingTemplateId) {
                    var compiled = Handlebars.compile($("#" + columnConfig.CellRenderingTemplateId).html());
                    this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                        (function (compl) { return function (x) { return $(compl(x.DataObject)); }; })(compiled);
                    continue;
                }
                this.ColumnsRenderFunctions[columnConfig.RawColumnName] =
                    function (x) { return $("<" + defaultCellElement + ">" + ((x.Data !== null && x.Data !== undefined) ? x.Data : '') + "</" + defaultCellElement + ">"); };
            }
            ;
        };
        return Renderer;
    })();
    PowerTables.Renderer = Renderer;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Renderer.js.map