module PowerTables.Templating {
    export interface ITemplatesLib {
        Prefix: string;
        Templates: { [_: string]: ITemplateDel }
    }

    export interface ITemplateDel {
        (data: any, driver: any, w: IWriteFn, p: TemplateProcess): void;
    }

    export interface IWriteFn {
        (str: string): void;
    }

    export interface ITemplateResult {
        Html: string;
        BackbindInfo: IBackbindInfo;
    }


}
