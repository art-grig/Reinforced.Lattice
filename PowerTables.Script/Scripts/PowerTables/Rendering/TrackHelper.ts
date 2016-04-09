
module PowerTables.Rendering {
    /**
    * Helper class for producing track ids
    */
    export class TrackHelper {
        /*
         * Returns string track ID for cell
         */
        public static getCellTrack(cell: ICell): string {
            var colIdx = cell.Column.MasterTable.getColumnNames().indexOf(cell.Column.RawName);
            var rowIdx = cell.Row.Index;
            return this.getCellTrackByIndexes(rowIdx,colIdx);
        }

        /*
         * Returns string track ID for cell
         */
        public static getCellTrackByIndexes(rowIndex:number,columnIndex:number): string {
            return `c-r${rowIndex}-c${columnIndex}`;
        }

        /*
         * Returns string track ID for plugin
         */
        public static getPluginTrack(plugin: IPlugin): string {
            return `p-${plugin.PluginLocation}`;
        }

        /*
         * Returns string track ID for plugin
         */
        public static getPluginTrackByLocation(pluginLocation: string): string {
            return `p-${pluginLocation}`;
        }

        /*
         * Returns string track ID for header
         */
        public static getHeaderTrack(header: IColumnHeader): string {
            return `h-${header.Column.RawName}`;
        }

        /*
         * Returns string track ID for header
         */
        public static getHeaderTrackByColumnName(columnName: string): string {
            return `h-${columnName}`;
        }

        /*
         * Returns string track ID for row
         */
        public static getRowTrack(row: IRow): string {
            return this.getRowTrackByIndex(row.Index);
        }

        /*
         * Returns string track ID for row
         */
        public static getRowTrackByIndex(index: number): string {
            return `r-${index}`;
        }

        
    }
}