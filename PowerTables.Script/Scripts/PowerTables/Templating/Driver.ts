module PowerTables.Templating {
    export class Driver {
        public static body(p: PowerTables.Templating.TemplateProcess) {
            p.w('<input type="hidden" data-track="tableBodyHere" style="display:none;"/>');
        }

        public static content(p: PowerTables.Templating.TemplateProcess, columnName?: string) {
            if (p.Model.renderContent) {
                return p.Model.renderContent(p);
            } else {
                switch (p.Type) {
                    case RenderedObject.Header:
                        Driver.renderHeaderContent(p);
                        break;
                    case RenderedObject.Plugin:
                        // if we are here then plugin's renderContent is not 
                        // overriden
                        throw new Error('It is required to override renderContent for plugin');
                    case RenderedObject.Row:
                        Driver.renderRowContent(p, columnName);
                        break;
                    case RenderedObject.Cell:
                        Driver.renderCellContent(p);
                        break;
                    default:
                        throw new Error('Unknown rendering context type');

                }
            }
        }

        private static renderHeaderContent(p: PowerTables.Templating.TemplateProcess) {
            var head = <IColumnHeader>p.Model;
            var content = head.Column.Configuration.Title || head.Column.RawName;
            p.w(content);
        }

        private static renderRowContent(p: PowerTables.Templating.TemplateProcess,columnName?:string) {
            var row: IRow = <IRow>p.Model;
            var columns: IColumn[] = p.UiColumns;
            
            for (var i: number = 0; i < columns.length; i++) {
                var cell: ICell = row.Cells[columns[i].RawName];
                if (columnName != null && columnName != undefined && typeof columnName == 'string') {
                    if (cell.Column.RawName === columnName) {
                        Driver.renderCellAsPartOfRow(cell, p);
                    }
                } else {
                    Driver.renderCellAsPartOfRow(cell, p);
                }
            }
        }

        private static renderCellAsPartOfRow(cell: ICell, p:TemplateProcess): void {
            if (cell.renderElement) cell.renderElement(p);
            else {
                if (cell.Column.Configuration.TemplateSelector) {
                    cell.TemplateIdOverride = cell.Column.Configuration.TemplateSelector(cell);
                }
                if (cell.TemplateIdOverride) {
                    p.nest(cell,cell.TemplateIdOverride);
                } else {
                    p.nest(cell, p.Executor.CoreTemplateIds.CellWrapper);
                }
            }
        }

        private static renderCellContent(p: TemplateProcess): void {
            var cell = <ICell>p.Model;
            var tpl = p.Executor.ColumnRenderes[cell.Column.RawName];
            if (typeof tpl === "string") {
                p.nest(cell, cell.Column.Configuration.CellRenderingTemplateId);
            } else {
                p.w(tpl(cell));
            }
        }

    }
}