module PowerTables.Rendering {
    
    /**
     * This module allows you to locate particular elements in table's DOM
     */
    export class DOMLocator {
        constructor(bodyElement: HTMLElement, rootElement: HTMLElement, rootId: string) {
            this._bodyElement = bodyElement;
            this._rootElement = rootElement;
            this._rootIdPrefix = `#${rootId} `;
        }

        private _bodyElement: HTMLElement;
        private _rootElement: HTMLElement;
        private _rootIdPrefix: string;

        /**
         * Retrieves cell element from supplied body
         * 
         * @param cell Cell element
         * @returns {} 
         */
        public getCellElement(cell: ICell): HTMLElement {
            var track = TrackHelper.getCellTrack(cell);
            return <HTMLElement>this._bodyElement.querySelector(`[data-track="${track}"]`);
        }

        /**
         * Retrieves row element (including wrapper)
         * 
         * @param row Row
         * @returns HTML element
         */
        public getRowElement(row: IRow): HTMLElement {
            var track = TrackHelper.getRowTrack(row);
            return <HTMLElement>this._bodyElement.querySelector(`[data-track="${track}"]`);
        }

        /**
         * Retrieves data cells for specified column (including wrappers)
         * 
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        public getColumnCellsElements(column: IColumn): NodeList {
            var colIdx = column.MasterTable.getColumnNames().indexOf(column.RawName);
            return this._bodyElement.querySelectorAll(`[data-track$="-c${colIdx}"]`);
        }

        /**
         * Retrieves data cells for whole row (including wrapper)
         * 
         * @param row Row with data cells
         * @returns NodeList containing results 
         */
        public getRowCellsElements(row: IRow): NodeList {
            return this.getRowCellsElementsByIndex(row.Index);
        }

        /**
         * Retrieves data cells for whole row (including wrapper)
         * 
         * @param row Row with data cells
         * @returns NodeList containing results 
         */
        public getRowCellsElementsByIndex(rowDisplayingIndex:number): NodeList {
            return this._bodyElement.querySelectorAll(`[data-track^="c-r${rowDisplayingIndex}-"]`);
        }

        /**
         * Retrieves HTML element for column header (including wrapper)
         * 
         * @param header Column header
         * @returns HTML element 
         */
        public getHeaderElement(header: IColumnHeader): HTMLElement {
            var track = TrackHelper.getHeaderTrack(header);
            return <HTMLElement>this._rootElement.querySelector(`[data-track="${track}"]`);
        }

        /**
         * Retrieves HTML element for plugin (including wrapper)
         * 
         * @param plugin Plugin
         * @returns HTML element 
         */
        public getPluginElement(plugin: IPlugin): HTMLElement {
            var track = TrackHelper.getPluginTrack(plugin);
            return <HTMLElement>this._rootElement.querySelector(`[data-track="${track}"]`);
        }

        
    }
} 