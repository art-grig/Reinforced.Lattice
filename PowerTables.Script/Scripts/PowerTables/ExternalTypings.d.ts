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
        compile(input: any, options?: any): HandlebarsTemplateDelegate;
        templates: HandlebarsTemplates;
    }
    export function create(): IHandlebars;
    
    interface HandlebarsTemplates {
        [index: string]: HandlebarsTemplateDelegate;
    }
}
interface HandlebarsTemplateDelegate {
    (context: any, options?: any): string;
}
