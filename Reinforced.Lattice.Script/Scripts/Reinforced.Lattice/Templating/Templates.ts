module Reinforced.Lattice.Templating {
    export interface ITemplatesLib {
        Prefix: string;
        Templates: { [_: string]: ITemplateDel }
    }

    export interface ITemplateDel {
        (data: any, driver: any, w: IWriteFn, p: TemplateProcess, s: IWriteFn): void;
    }

    export interface IWriteFn {
        (str: string | number): void;
    }

    export interface ITemplateResult {
        Html: string;
        BackbindInfo: IBackbindInfo;
    }


}
