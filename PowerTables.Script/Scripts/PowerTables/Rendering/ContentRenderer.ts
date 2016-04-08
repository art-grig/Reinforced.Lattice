module PowerTables.Rendering {

    /**
     * Part of renderer that is responsible for rendering of dynamically loaded content
     */
    export class ContentRenderer {
        constructor(templatesProvider: ITemplatesProvider, stack: PowerTables.Rendering.RenderingStack, instances: InstanceManager) {
            this._hb = templatesProvider.HandlebarsInstance;
            this._templatesProvider = templatesProvider;
            this._stack = stack;
            this._instances = instances;
        }

        private _hb: Handlebars.IHandlebars;
        private _templatesProvider: ITemplatesProvider;
        private _columnsRenderFunctions: { [key: string]: (x: ICell) => string };
        private _stack: RenderingStack;
        private _instances: InstanceManager;

        /**
         * Renders supplied table rows to string
         * 
         * @param rows Table rows
         * @returns String containing HTML of table rows
         */
        public renderBody(rows: IRow[]): string {
            var result = '';
            var wrapper = this._templatesProvider.getCachedTemplate('rowWrapper');
            for (var i = 0; i < rows.length; i++) {
                var rw = rows[i];
                if (rw.renderElement) {
                    result += rw.renderElement(this._templatesProvider);
                } else {
                    result += wrapper(rw);
                }
            }
            return result;
        }

        public renderContent(columnName?: string) {
            var result = '';
            switch (this._stack.Current.Type) {
                case RenderingContextType.Row:
                    var row = <IRow> this._stack.Current.Object;
                    var columns = this._instances.getUiColumns();
                    var cellWrapper = this._templatesProvider.getCachedTemplate('cellWrapper');
                    for (var i = 0; i < columns.length; i++) {
                        var cell = row.Cells[columns[i].RawName];
                        this._stack.push(RenderingContextType.Cell, cell, columns[i].RawName);
                        result += cellWrapper(cell);
                        this._stack.popContext();
                    }
                    break;
                case RenderingContextType.Cell:
                    var tmpl = this._columnsRenderFunctions[(<ICell>this._stack.Current.Object).Column.RawName];
                    result += tmpl((<ICell>this._stack.Current.Object));
                    break;
            }
            return result;
        }

        private cacheColumnRenderers(columns: { [key: string]: IColumn }) {
            for (var key in columns) {
                if (columns.hasOwnProperty(key)) {
                    var columnConfig = columns[key].Configuration;
                    if (columnConfig.CellRenderingValueFunction) {
                        this._columnsRenderFunctions[columnConfig.RawColumnName] =
                        (x: ICell) => {
                            return x.Column.Configuration.CellRenderingValueFunction(x.DataObject);
                        };
                        continue;
                    }
                    if (columnConfig.CellRenderingTemplateId) {
                        var compiled = this._hb.compile(document.getElementById(columnConfig.CellRenderingTemplateId).innerHTML);
                        this._columnsRenderFunctions[columnConfig.RawColumnName] =
                        (compl => (x: ICell) => compl(x.DataObject))(compiled);
                        continue;
                    }
                    this._columnsRenderFunctions[columnConfig.RawColumnName] =
                    (x: ICell) => ((x.Data !== null && x.Data !== undefined) ? x.Data : '');
                }
            };
        }
    }
} 