
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
            return `c-r${rowIdx}-c${colIdx}`;
        }

        /*
         * Returns string track ID for plugin
         */
        public static getPluginTrack(plugin: IPlugin): string {
            return `p-${plugin.PluginLocation}`; //todo
        }

        /*
         * Returns string track ID for header
         */
        public static getHeaderTrack(header: IColumnHeader): string {
            return `h-${header.Column.RawName}`;
        }

        /*
         * Returns string track ID for row
         */
        public static getRowTrack(row: IRow): string {
            return `r-${row.Index}`;
        }

        /*
         * Retrieves cell element from supplied body
         */
        public static getCellElement(body: HTMLElement, cell: ICell): HTMLElement {
            var track = this.getCellTrack(cell);
            return <HTMLElement>body.querySelector(`[data-track="${track}"]`);
        }

        /*
         * Retrieves row element from supplied body
         */
        public static getRowElement(body: HTMLElement, row: IRow): HTMLElement {
            var track = this.getRowTrack(row);
            return <HTMLElement>body.querySelector(`[data-track="${track}"]`);
        }

        /*
         * Retrieves cells for each column
         */
        public static getColumnCellsElements(body: HTMLElement, column: IColumn): NodeList {
            var colIdx = column.MasterTable.getColumnNames().indexOf(column.RawName);
            return body.querySelectorAll(`[data-track$="-c${colIdx}"]`);
        }

        /*
         * Retrieves cells for each column
         */
        public static getRowCellsElements(body: HTMLElement, row: IRow): NodeList {
            return body.querySelectorAll(`[data-track^="c-r${row.Index}-"]`);
        }

        public static getHeaderElement(table: HTMLElement, header: IColumnHeader): HTMLElement {
            var track = this.getHeaderTrack(header);
            return <HTMLElement>table.querySelector(`[data-track="${track}"]`);
        }

        public static getPluginElement(table: HTMLElement, plugin: IPlugin): HTMLElement {
            var track = this.getPluginTrack(plugin);
            return <HTMLElement>table.querySelector(`[data-track="${track}"]`);
        }
    }
}