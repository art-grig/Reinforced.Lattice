module PowerTables.Rendering {
    export class ContentRenderer {
        private _hb: Handlebars.IHandlebars;
        private _templatesProvider: ITemplatesProvider;
        private _columnsRenderFunctions: { [key: string]: (x: ICell) => string };
        private _stack: RenderingStack;

        private _currentRow:IRow;

        public renderBody(rows: IRow[]): string {
            var result = '';
            var wrapper = this._templatesProvider.getCachedTemplate('rowWrapper');
            for (var i = 0; i < rows.length; i++) {
                var rw = rows[i];
                this._currentRow = rw;
                if (rw.renderElement) {
                    result += rw.renderElement(this._templatesProvider);
                } else {
                    result += wrapper(rw);
                }
            }
            return result;
        }

        public renderContent(columnName?: string) {
            switch (this._stack.Current.Type) {
                case RenderingContextType.Row:
                    break;//todo
                case RenderingContextType.Cell:
                    break; //todo
                
            }
            return '';
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