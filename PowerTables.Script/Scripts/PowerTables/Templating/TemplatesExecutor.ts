module PowerTables.Templating {
    export class TemplatesExecutor {
        private _lib: ITemplatesLib;
        public ColumnRenderes: { [key: string]: (x: ICell) => string } = {};
        public CoreTemplateIds: ICoreTemplateIds;
        public Instances: PowerTables.Services.InstanceManagerService;

        private _uiColumns: () => IColumn[];
        constructor(lib: ITemplatesLib, instnaces: PowerTables.Services.InstanceManagerService) {
            this._lib = lib;
            this.CoreTemplateIds = instnaces.Configuration.CoreTemplates;
            this.cacheColumnRenderers(instnaces.Columns);
            this._uiColumns = ()=>this.Instances.getUiColumns();
            this.Instances = instnaces;
        }

        private cacheColumnRenderers(columns: { [key: string]: IColumn }) {
            for (var key in columns) {
                if (columns.hasOwnProperty(key)) {
                    var columnConfig: Configuration.Json.IColumnConfiguration = columns[key].Configuration;
                    if (columnConfig.CellRenderingValueFunction) {
                        this.ColumnRenderes[columnConfig.RawColumnName] = columnConfig.CellRenderingValueFunction;
                        continue;
                    }
                    if (columnConfig.CellRenderingTemplateId) {
                        this.ColumnRenderes[columnConfig.RawColumnName] = <any>'template';
                        continue;
                    }
                    this.ColumnRenderes[columnConfig.RawColumnName] =
                        (x: ICell) => ((x.Data !== null && x.Data != undefined) ? x.Data : '');
                }
            };
        }

        public executeLayout(): ITemplateResult {
            return this.execute(null, this.CoreTemplateIds.Layout);
        }

        public beginProcess(): TemplateProcess {
            return new TemplateProcess(this._uiColumns,this);
        }

        public endProcess(tp: TemplateProcess): ITemplateResult {
            return {
                Html: tp.Html,
                BackbindInfo: tp.BackInfo
            }
        }

        public execute(data: any, templateId: string): ITemplateResult {
            if (!this._lib.Templates.hasOwnProperty(templateId)) {
                throw new Error(`Cannot find template ${templateId}`);
            }
            var tp = new TemplateProcess(this._uiColumns, this);
            this._lib.Templates[templateId](data, PowerTables.Templating.Driver, tp.w, tp,tp.s);
            return {
                Html: tp.Html,
                BackbindInfo: tp.BackInfo
            }
        }

        public nest(data: any, templateId: string, p: TemplateProcess): void {
            if (!this._lib.Templates.hasOwnProperty(templateId)) {
                throw new Error(`Cannot find template ${templateId}`);
            }
            this._lib.Templates[templateId](data, PowerTables.Templating.Driver, p.w, p, p.s);
        }


        public hasTemplate(templateId: string): boolean {
            return this._lib.Templates.hasOwnProperty(templateId);
        }

        public obtainRowTemplate(rw: IRow): string {
            if (this.Instances.Configuration.TemplateSelector) {
                var to = this.Instances.Configuration.TemplateSelector(rw);
                if (!(!to)) rw.TemplateIdOverride = to;
            }
            if (rw.TemplateIdOverride) {
                return rw.TemplateIdOverride;
            }
            return this.CoreTemplateIds.RowWrapper;
        }

        public obtainCellTemplate(cell: ICell): string {
            if (cell.Column.Configuration.TemplateSelector) {
                cell.TemplateIdOverride = cell.Column.Configuration.TemplateSelector(cell);
            }
            if (cell.TemplateIdOverride) {
                return cell.TemplateIdOverride;
            }
            return this.CoreTemplateIds.CellWrapper;
        }

    }
}