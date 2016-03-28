module PowerTables.Rendering {
    export class ContentRenderer {
        private _hb: Handlebars.IHandlebars;
        private _columnsRenderFunctions: { [key: string]: (x: ICell) => string };

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