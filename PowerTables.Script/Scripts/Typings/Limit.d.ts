declare module PowerTables.Plugins {
    /**
     * Limit plugin interface
     */
    export interface ILimitPlugin {
        /**
         * Changeable. Will refresh after plugin redraw
         */
        SelectedValue: string;

        /**
         * Changeable. Will refresh after plugin redraw
         */
        Sizes: ILimitSize[];

        /**
         * Changes limit settings and updates UI
         * 
         * @param limit Selected limit
         * @returns {} 
         */
        changeLimit(limit: number);
    }
} 