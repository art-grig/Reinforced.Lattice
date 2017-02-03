module PowerTables.Templating {
    export class TemplatesExecutor {
        private _lib: ITemplatesLib;
        public ColumnRenderes: { [key: string]: (x: ICell) => string }
        public CoreTemplateIds: ICoreTemplateIds;
        private _uiColumns: () => IColumn[];
        constructor(lib: ITemplatesLib, coreTemplates: ICoreTemplateIds, columns: { [key: string]: IColumn }, uiColumns: () => IColumn[]) {
            this._lib = lib;
            this.CoreTemplateIds = coreTemplates;
            this.cacheColumnRenderers(columns);
            this._uiColumns = uiColumns;
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
            return new TemplateProcess(this._uiColumns);
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
            var tp = new TemplateProcess(this._uiColumns);
            this._lib.Templates[templateId](data, PowerTables.Templating.Driver, tp.w, tp);
            return {
                Html: tp.Html,
                BackbindInfo: tp.BackInfo
            }
        }

        public nest(data: any, templateId: string, p: TemplateProcess): void {
            if (!this._lib.Templates.hasOwnProperty(templateId)) {
                throw new Error(`Cannot find template ${templateId}`);
            }
            this._lib.Templates[templateId](data, PowerTables.Templating.Driver, p.w, p);
        }


        public hasTemplate(templateId: string): boolean {
            return this._lib.Templates.hasOwnProperty(templateId);
        }



    }
}