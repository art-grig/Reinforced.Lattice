module PowerTables.Templating {
    export class Driver {
        public static body(p: PowerTables.Templating.TemplateProcess) {
            p.w('<input type="hidden" data-track="tableBodyHere" style="display:none;"/>');
        }

        public static content(p: PowerTables.Templating.TemplateProcess, columnName?: string) {
            if (p.Context.Object.renderContent) {
                p.Context.Object.renderContent(p);
            } else {
                switch (p.Context.Type) {
                    case RenderedObject.Header:
                        Driver.headerContent(<any>p.Context.Object, p);
                        break;
                    case RenderedObject.Plugin:
                        // if we are here then plugin's renderContent is not 
                        // overriden
                        throw new Error('It is required to override renderContent for plugin');
                    case RenderedObject.Row:
                        Driver.rowContent(<any>p.Context.Object, p, columnName);
                        break;
                    case RenderedObject.Cell:
                        Driver.cellContent(<any>p.Context.Object, p);
                        break;
                    default:
                        throw new Error('Unknown rendering context type');

                }
            }
        }

        public static row(p: PowerTables.Templating.TemplateProcess, row: IRow) {
            p.nestElement(row, p.Executor.obtainRowTemplate(row), RenderedObject.Row);
        }

        public static headerContent(head: IColumnHeader, p: PowerTables.Templating.TemplateProcess) {
            var content = head.Column.Configuration.Title || head.Column.RawName;
            p.w(content);
        }

        public static rowContent(row: IRow, p: PowerTables.Templating.TemplateProcess, columnName?: string) {
            var columns: IColumn[] = p.UiColumns;

            for (var i: number = 0; i < columns.length; i++) {
                var c: ICell = row.Cells[columns[i].RawName];
                if (columnName != null && columnName != undefined && typeof columnName == 'string') {
                    if (c.Column.RawName === columnName) {
                        Driver.cell(p, c);
                    }
                } else {
                    Driver.cell(p, c);
                }
            }
        }

        public static cell(p: TemplateProcess, cell: ICell): void {
            p.nestElement(cell, p.Executor.obtainCellTemplate(cell), RenderedObject.Cell);
        }

        public static cellContent(c: ICell, p: TemplateProcess): void {
            var tpl = p.Executor.ColumnRenderes[c.Column.RawName];
            if (typeof tpl === "string") {
                p.nest(c, c.Column.Configuration.CellRenderingTemplateId);
            } else {
                p.w(tpl(c));
            }
        }

        public static plugin(p: TemplateProcess, pluginPosition: string, pluginId: string): void {
            var plugin: IPlugin = p.Executor.Instances.getPlugin<IPlugin>(pluginId, pluginPosition);
            Driver.renderPlugin(p, plugin);
        }

        public static plugins(p: TemplateProcess, pluginPosition: string): void {
            var plugins: IPlugin[] = p.Executor.Instances.getPlugins(pluginPosition);
            if (!plugins) return;

            for (var a in plugins) {
                if (plugins.hasOwnProperty(a)) {
                    var v: IPlugin = plugins[a];
                    Driver.renderPlugin(p, v);
                }
            }
        }

        public static renderPlugin(p: TemplateProcess, plugin: IPlugin): void {
            if (plugin.renderElement) {
                p.d(plugin, RenderedObject.Plugin);
                plugin.renderElement(p);
                p.u();
                return;
            }
            if (!plugin.renderContent) return;
            p.nest(plugin, p.Executor.CoreTemplateIds.PluginWrapper);
        }

        public static colHeader(p: PowerTables.Templating.TemplateProcess, columnName: string): void {
            try {
                Driver.header(p, p.Executor.Instances.getColumn(columnName));
            } catch (a) {
            }
        }

        /**
         * Renders specified column's header into string including its wrapper
         * 
         * @param column Column which header is about to be rendered
         * @returns {} 
         */
        public static header(p: PowerTables.Templating.TemplateProcess, column: IColumn): void {
            if (column.Header.renderElement) {
                p.d(column.Header, RenderedObject.Header);
                column.Header.renderElement(p);
                p.u();
            }
            else {
                p.nest(column.Header, column.Header.TemplateIdOverride || p.Executor.CoreTemplateIds.HeaderWrapper);
            }
        }

        public static headers(p: TemplateProcess): void {
            var columns: IColumn[] = p.UiColumns;
            for (var a in columns) {
                if (columns.hasOwnProperty(a)) {
                    Driver.header(p, columns[a]);
                }
            }
        }

    }
}