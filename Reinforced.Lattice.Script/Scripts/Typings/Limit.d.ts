declare module Reinforced.Lattice.Plugins.Limit {
    /**
     * Limit plugin interface
     */
    export interface ILimitPlugin {
        /**
         * Changeable. Will refresh after plugin redraw
         */
        SelectedValue: ILimitSize;

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