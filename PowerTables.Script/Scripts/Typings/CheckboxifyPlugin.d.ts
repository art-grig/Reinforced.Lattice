
declare module PowerTables.Plugins {
    export interface ICheckboxifyPlugin {
        selectByRowIndex(rowIndex: number): void;
        getSelection(): string[];
        selectAll(selected?: boolean): void;
    }
    
}
/*
declare module PowerTables {
    interface EventsService {
        SelectionChanged: TableEvent<string[]>;
    }    
}
*/