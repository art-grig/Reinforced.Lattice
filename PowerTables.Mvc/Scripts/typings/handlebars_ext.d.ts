declare module Handlebars {
    export interface IHandlebars {
        registerHelper(name: string, fn: Function, inverse?: boolean): void;
        registerPartial(name: string, str: any): void;
        unregisterPartial(name: string): void;
        unregisterHelper(name: string): void;

        K(): void;
        createFrame(object: any): any;
        Exception(message: string): void;
        log(level: number, obj: any): void;
        parse(input: string): hbs.AST.Program;
        compile(input: any, options?: any): HandlebarsTemplateDelegate;
        noConflict(): void;

        SafeString: typeof hbs.SafeString;
        Utils: typeof hbs.Utils;
        logger: Logger;
        templates: HandlebarsTemplates;
    }
    export function create(): IHandlebars;
} 