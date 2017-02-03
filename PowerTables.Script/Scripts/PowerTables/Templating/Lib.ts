module PowerTables.Templating {
    export class _ltcTpl {

        private static _lib: { [_: string]: ITemplatesLib } = {};
        private static _executors: { [_: string]: TemplatesExecutor } = {};

        public static _(prefix: string, id: string, tpl: ITemplateDel): void {
            if (!_ltcTpl._lib[prefix]) _ltcTpl._lib[prefix] = { Prefix: prefix, Templates: {} };
            _ltcTpl._lib[prefix].Templates[id] = tpl;
        }

        public static executor(prefix: string, coreTemplates: ICoreTemplateIds, columns: { [key: string]: IColumn }, uiColumns: () => IColumn[]): TemplatesExecutor {
            if (!_ltcTpl._lib.hasOwnProperty(prefix)) {
                throw new Error(`Cannot find templates set with prefix ${prefix}`); 
            }
            if (!_ltcTpl._executors[prefix]) {
                _ltcTpl._executors[prefix] = new TemplatesExecutor(_ltcTpl._lib[prefix],coreTemplates,columns,uiColumns);
            }
            return _ltcTpl._executors[prefix];
        }

    }
}