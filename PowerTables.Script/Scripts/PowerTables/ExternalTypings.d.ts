
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


declare module PowerTables {

    /**
     * Main table interface for breaking additional dependencies
     */
    export interface IInternalTable {
        /**
        * Events manager - entry point for raising and handling various table events
        */
        Events: EventsManager;
    }

    /**
     * Client filter interface. 
     * This interface is registerable in the DataHolder as 
     * one of the part of filtering pipeline
     */
    export interface IClientFilter {
        
        /**
         * Predicate function that must return 'true' for 
         * row that is actually suitable to be displayed according to 
         * implementor's settings
         * 
         * @param rowObject Row table object
         * @param query Data query
         * @returns True if row is suitable to be shown. False otherwise
         */
        filterPredicate(rowObject: any, query: IQuery): boolean;
    }

    /**
     * Interface for modifying of source data set on client side
     */
    export interface IClientTruncator {
        /**
         * This method should consume source 
         * data set and produce resulting set. 
         * Here you can truncate results e.g. apply paging.
         * 
         * By technical reasons it can be only one client selector registered on table. 
         * 
         * 
         * @param sourceDataSet Array of data objects received from server
         * @param query Data query
         */
        selectData(sourceDataSet: any[], query: IQuery): any[];
    }
}
 
