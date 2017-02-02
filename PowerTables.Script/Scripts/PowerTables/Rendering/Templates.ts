export module PowerTables {
    export class TemplatesExecutor {
        constructor(lib: ITemplatesLib) { this._lib = lib; }

        private _lib: ITemplatesLib;

    }
}

export class _ltcTpl {

    private static _lib: { [_: string]: ITemplatesLib } = {};
    private static _executors: { [_: string]: PowerTables.TemplatesExecutor } = {};

    public static _(prefix: string, id: string, tpl: ITemplateDel): void {
        if (!_ltcTpl._lib[prefix]) _ltcTpl._lib[prefix] = { Prefix: prefix, Templates: {} };
        _ltcTpl._lib[prefix].Templates[id] = tpl;
    }

    public static executor(prefix: string): PowerTables.TemplatesExecutor {
        if (!_ltcTpl._executors[prefix]) {
            _ltcTpl._executors[prefix] = new PowerTables.TemplatesExecutor(_ltcTpl._lib[prefix]);
        }
        return _ltcTpl._executors[prefix];
    }

}

export interface ITemplatesLib {
    Prefix: string;
    Templates: { [_: string]: ITemplateDel }
}

export interface ITemplateDel {
    (data: any, driver: any, w: IWriteFn): void;
}

export interface IWriteFn {
    (str: string): void;
}