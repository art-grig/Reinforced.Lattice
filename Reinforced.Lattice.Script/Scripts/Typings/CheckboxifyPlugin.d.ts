
declare module Reinforced.Lattice.Plugins {
    export interface ICheckboxifyPlugin {
        selectByRowIndex(rowIndex: number): void;
        getSelection(): string[];
        selectAll(selected?: boolean): void;
    }
    
}
/*
declare module Reinforced.Lattice {
    interface EventsService {
        SelectionChanged: TableEvent<string[]>;
    }    
}
*/