declare module PowerTables.Plugins {
    /**
     * Paging plugin external interface
     */
    export interface IPagingPlugin extends IPlugin {
        /**
         * Returns currently displaying page number
         * 
         * @returns {} 
         */
        getCurrentPage(): number;
        /**
         * Returns total pages count
         * 
         * @returns {} 
         */
        getTotalPages(): number;

        /**
         * Returns page size
         * 
         * @returns {} 
         */
        getPageSize(): number;

        /**
         * Switches currently displaying data to specified page
         * 
         * @param page Page number
         * @returns {} 
         */
        goToPage(page: any): void;
    }
} 