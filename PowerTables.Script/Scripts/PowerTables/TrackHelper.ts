
module PowerTables {
    /**
    * Helper class for producing track ids. 
    * You can use this class directly, but it is better to use it via @memberref PowerTables.PowerTable.Renderer.Rendering.Modifier instance
    */
    export class TrackHelper {
        /**
         * Returns string track ID for cell
         */
        public static getCellTrack(cell: ICell): string {
            var colIdx: number = cell.Column.Order;
            var rowIdx: number = cell.Row.Index;
            return TrackHelper.getCellTrackByIndexes(rowIdx, colIdx);
        }

        /**
         * Returns string track ID for cell
         */
        public static getCellTrackByIndexes(rowIndex: number, columnIndex: number): string {
            return `c-r${rowIndex}-c${columnIndex}`;
        }

        /**
         * Returns string track ID for plugin
         */
        public static getPluginTrack(plugin: IPlugin): string {
            return `p-${plugin.PluginLocation}`;
        }

        /**
         * Returns string track ID for plugin
         */
        public static getPluginTrackByLocation(pluginLocation: string): string {
            return `p-${pluginLocation}`;
        }

        /**
         * Returns string track ID for header
         */
        public static getHeaderTrack(header: IColumnHeader): string {
            return `h-${header.Column.RawName}`;
        }

        /**
         * Returns string track ID for header
         */
        public static getHeaderTrackByColumnName(columnName: string): string {
            return `h-${columnName}`;
        }

        /**
         * Returns string track ID for row
         */
        public static getRowTrack(row: IRow): string {
            return this.getRowTrackByIndex(row.Index);
        }

        /**
         * Returns string track ID for row
         */
        public static getRowTrackByObject(dataObject:any): string {
            return this.getRowTrackByIndex(dataObject['__i']);
        }

        /**
         * Returns string track ID for row
         */
        public static getMessageTrack(): string {
            return 'r-msg';
        }

        /**
         * Returns string track ID for row
         */
        public static getPartitionRowTrack(): string {
            return 'r-partition';
        }

        /**
         * Returns string track ID for row
         */
        public static getRowTrackByIndex(index: number): string {
            return `r-${index}`;
        }

        /**
         * Parses cell track to retrieve column and row index
         * 
         * @param e HTML element containing cell with wrapper
         * @returns {ICellLocation} Cell location
         */
        public static getCellLocation(e: HTMLElement): ICellLocation {
            if (!e) return null;
            if (!e.getAttribute) return null;
            var trk: string[] = e.getAttribute('data-track').substring(3).split('-c');
            return {
                RowIndex: parseInt(trk[0]),
                ColumnIndex: parseInt(trk[1])
            };
        }

        /**
         * Parses row track to retrieve row index
         * 
         * @param e HTML element containing row with wrapper
         * @returns {number} Row index
         */
        public static getRowIndex(e: HTMLElement): number {
            if (!e) return null;
            if (!e.getAttribute) return null;
            var trk: string = e.getAttribute('data-track').substring(2);
            return parseInt(trk);
        }

    }

    /**
     * Interface describing cell location
     */
    export interface ICellLocation {
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