declare module Reinforced.Lattice.Plugins {

    /**
     * Plugin for hiding and showing columns
     */
    export interface IHideoutPlugin {
        showColumnByName(rawColname: string): void;
        hideColumnByName(rawColname: string): void;
        toggleColumnByName(columnName: string): boolean;
        isColumnVisible(columnName: string): boolean;

        showColumnInstance(c: IColumn): void;
        hideColumnInstance(c: IColumn): void;
        isColumnInstanceVisible(col: IColumn): boolean;
    }
} 