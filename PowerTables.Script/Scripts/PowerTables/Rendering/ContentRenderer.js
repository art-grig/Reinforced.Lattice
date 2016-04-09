var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        var ContentRenderer = (function () {
            function ContentRenderer(templatesProvider, stack, instances) {
                this._hb = templatesProvider.HandlebarsInstance;
                this._templatesProvider = templatesProvider;
                this._stack = stack;
                this._instances = instances;
            }
            ContentRenderer.prototype.renderBody = function (rows) {
                var result = '';
                var wrapper = this._templatesProvider.getCachedTemplate('rowWrapper');
                for (var i = 0; i < rows.length; i++) {
                    var rw = rows[i];
                    if (rw.renderElement) {
                        result += rw.renderElement(this._templatesProvider);
                    }
                    else {
                        result += wrapper(rw);
                    }
                }
                return result;
            };
            ContentRenderer.prototype.renderContent = function (columnName) {
                var result = '';
                switch (this._stack.Current.Type) {
                    case Rendering.RenderingContextType.Row:
                        var row = this._stack.Current.Object;
                        var columns = this._instances.getUiColumns();
                        var cellWrapper = this._templatesProvider.getCachedTemplate('cellWrapper');
                        for (var i = 0; i < columns.length; i++) {
                            var cell = row.Cells[columns[i].RawName];
                            this._stack.push(Rendering.RenderingContextType.Cell, cell, columns[i].RawName);
                            result += cellWrapper(cell);
                            this._stack.popContext();
                        }
                        break;
                    case Rendering.RenderingContextType.Cell:
                        var tmpl = this._columnsRenderFunctions[this._stack.Current.Object.Column.RawName];
                        result += tmpl(this._stack.Current.Object);
                        break;
                }
                return result;
            };
            ContentRenderer.prototype.cacheColumnRenderers = function (columns) {
                for (var key in columns) {
                    if (columns.hasOwnProperty(key)) {
                        var columnConfig = columns[key].Configuration;
                        if (columnConfig.CellRenderingValueFunction) {
                            this._columnsRenderFunctions[columnConfig.RawColumnName] =
                                function (x) {
                                    return x.Column.Configuration.CellRenderingValueFunction(x.DataObject);
                                };
                            continue;
                        }
                        if (columnConfig.CellRenderingTemplateId) {
                            var compiled = this._hb.compile(document.getElementById(columnConfig.CellRenderingTemplateId).innerHTML);
                            this._columnsRenderFunctions[columnConfig.RawColumnName] =
                                (function (compl) { return function (x) { return compl(x.DataObject); }; })(compiled);
                            continue;
                        }
                        this._columnsRenderFunctions[columnConfig.RawColumnName] =
                            function (x) { return ((x.Data !== null && x.Data !== undefined) ? x.Data : ''); };
                    }
                }
                ;
            };
            return ContentRenderer;
        })();
        Rendering.ContentRenderer = ContentRenderer;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
