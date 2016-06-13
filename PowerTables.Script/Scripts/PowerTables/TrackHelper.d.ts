declare module PowerTables {
    /**
    * Helper class for producing track ids
    */
    class TrackHelper {
        /**
         * Returns string track ID for cell
         */
        static getCellTrack(cell: ICell): string;
        /**
         * Returns string track ID for cell
         */
        static getCellTrackByIndexes(rowIndex: number, columnIndex: number): string;
        /**
         * Returns string track ID for plugin
         */
        static getPluginTrack(plugin: IPlugin): string;
        /**
         * Returns string track ID for plugin
         */
        static getPluginTrackByLocation(pluginLocation: string): string;
        /**
         * Returns string track ID for header
         */
        static getHeaderTrack(header: IColumnHeader): string;
        /**
         * Returns string track ID for header
         */
        static getHeaderTrackByColumnName(columnName: string): string;
        /**
         * Returns string track ID for row
         */
        static getRowTrack(row: IRow): string;
        /**
         * Returns string track ID for row
         */
        static getRowTrackByIndex(index: number): string;
        /**
         * Parses cell track to retrieve column and row index
         *
         * @param e HTML element containing cell with wrapper
         * @returns {ICellLocation} Cell location
         */
        static getCellLocation(e: HTMLElement): ICellLocation;
        /**
         * Parses row track to retrieve row index
         *
         * @param e HTML element containing row with wrapper
         * @returns {number} Row index
         */
        static getRowIndex(e: HTMLElement): number;
    }
    /**
     * Interface describing cell location
     */
    interface ICellLocation {
        /**
         * Row index
         */
        RowIndex: number;
        /**
         * Column index
         */
        ColumnIndex: number;
    }
}
