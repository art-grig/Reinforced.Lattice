module PowerTables.Rendering {

    /**
     * This module allows you to locate particular elements in table's DOM
     */
    export class DOMLocator {
        constructor(bodyElement: HTMLElement, rootElement: HTMLElement, rootId: string) {
            this._bodyElement = bodyElement;
            this._rootElement = rootElement;
            this._rootIdPrefix = `#${rootId}`;
        }

        private _bodyElement: HTMLElement;
        private _rootElement: HTMLElement;
        private _rootIdPrefix: string;

        /**
         * Retrieves cell element by cell object
         * 
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        public getCellElement(cell: ICell): HTMLElement {
            var track: string = TrackHelper.getCellTrack(cell);
            return <HTMLElement>this._bodyElement.querySelector(`${this._rootIdPrefix} [data-track="${track}"]`);
        }

        /**
         * Retrieves cell element using supplied coordinates
         * 
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        public getCellElementByIndex(rowDisplayIndex: number, columnIndex: number): HTMLElement {
            var track: string = TrackHelper.getCellTrackByIndexes(rowDisplayIndex, columnIndex);
            return <HTMLElement>this._bodyElement.querySelector(`${this._rootIdPrefix} [data-track="${track}"]`);
        }

        /**
         * Retrieves row element (including wrapper)
         * 
         * @param row Row
         * @returns HTML element
         */
        public getRowElement(row: IRow): HTMLElement {
            var track: string = TrackHelper.getRowTrack(row);
            return <HTMLElement>this._bodyElement.querySelector(`${this._rootIdPrefix} [data-track="${track}"]`);
        }

        /**
        * Retrieves row element (including wrapper) by specified row index
        * 
        * @param row Row
        * @returns HTML element
        */
        public getRowElementByIndex(rowDisplayingIndex: number): HTMLElement {
            var track: string = TrackHelper.getRowTrackByIndex(rowDisplayingIndex);
            return <HTMLElement>this._bodyElement.querySelector(`${this._rootIdPrefix} [data-track="${track}"]`);
        }

        /**
         * Retrieves data cells for specified column (including wrappers)
         * 
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        public getColumnCellsElements(column: IColumn): NodeList {
            var colIdx: number = column.MasterTable.InstanceManager.getUiColumnNames().indexOf(column.RawName);
            return this._bodyElement.querySelectorAll(`${this._rootIdPrefix} [data-track$="-c${colIdx}"]`);
        }

        /**
         * Retrieves data cells for specified column (including wrappers) by column index
         * 
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        public getColumnCellsElementsByColumnIndex(columnIndex: number): NodeList {
            return this._bodyElement.querySelectorAll(`${this._rootIdPrefix} [data-track$="-c${columnIndex}"]`);
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
        public getRowCellsElementsByIndex(rowDisplayingIndex: number): NodeList {
            return this._bodyElement.querySelectorAll(`${this._rootIdPrefix} [data-track^="c-r${rowDisplayingIndex}-"]`);
        }

        /**
         * Retrieves HTML element for column header (including wrapper)
         * 
         * @param header Column header
         * @returns HTML element 
         */
        public getHeaderElement(header: IColumnHeader): HTMLElement {
            var track: string = TrackHelper.getHeaderTrack(header);
            return <HTMLElement>this._rootElement.querySelector(`${this._rootIdPrefix} [data-track="${track}"]`);
        }

        /**
         * Retrieves HTML element for plugin (including wrapper)
         * 
         * @param plugin Plugin
         * @returns HTML element 
         */
        public getPluginElement(plugin: IPlugin): HTMLElement {
            var track: string = TrackHelper.getPluginTrack(plugin);
            return <HTMLElement>this._rootElement.querySelector(`${this._rootIdPrefix} [data-track="${track}"]`);
        }

        /**
         * Retrieves HTML element for plugin (including wrapper)
         * 
         * @param plugin Plugin
         * @returns HTML element 
         */
        public getPluginElementsByPositionPart(placement: string): NodeList {
            var track: string = TrackHelper.getPluginTrackByLocation(placement);
            return this._rootElement.querySelectorAll(`${this._rootIdPrefix} [data-track^="${track}"]`);
        }

        /**
         * Determines if supplied element is table row
         * 
         * @param e Testing element
         * @returns {boolean} True when supplied element is row, false otherwise
         */
        public isRow(e: HTMLElement): boolean {
            if (!e) return false;
            if (!e.getAttribute) return false;
            var trk: string = e.getAttribute('data-track');
            if (!trk) return false;
            return (trk.charAt(0) === 'r') && (trk.charAt(1) === '-');
        }

        /**
         * Determines if supplied element is table cell
         * 
         * @param e Testing element
         * @returns {boolean} True when supplied element is cell, false otherwise
         */
        public isCell(e: HTMLElement): boolean {
            if (!e) return false;
            if (!e.getAttribute) return false;
            var trk: string = e.getAttribute('data-track');
            if (!trk) return false;
            return (trk.charAt(0) === 'c')
                && (trk.charAt(1) === '-')
                && (trk.charAt(2) === 'r');
        }

    }
}