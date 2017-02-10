module PowerTables.Templating {
    export class _ltcTpl {
        private static _lib: { [_: string]: ITemplatesLib } = {};
        public static _(prefix: string, id: string, tpl: ITemplateDel): void {
            if (!_ltcTpl._lib[prefix]) _ltcTpl._lib[prefix] = { Prefix: prefix, Templates: {} };
            _ltcTpl._lib[prefix].Templates[id] = tpl;
        }
        public static executor(prefix: string, table: PowerTables.IMasterTable): TemplatesExecutor {
            if (!_ltcTpl._lib.hasOwnProperty(prefix)) {
                throw new Error(`Cannot find templates set with prefix ${prefix}`);
            }
            return new TemplatesExecutor(_ltcTpl._lib[prefix], table);
        }

    }
}