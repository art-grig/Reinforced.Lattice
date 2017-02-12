declare module PowerTables.Rendering {
    /**
     * This module allows you to locate particular elements in table's DOM
     */
    class DOMLocator {
        constructor(bodyElement: HTMLElement, rootElement: HTMLElement, rootId: string);
        private _bodyElement;
        private _rootElement;
        private _rootIdPrefix;
        /**
         * Retrieves cell element by cell object
         *
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        getCellElement(cell: ICell): HTMLElement;
        /**
         * Retrieves cell element using supplied coordinates
         *
         * @param cell Cell element
         * @returns {HTMLElement} Element containing cell (with wrapper)
         */
        getCellElementByIndex(rowDisplayIndex: number, columnIndex: number): HTMLElement;
        /**
         * Retrieves row element (including wrapper)
         *
         * @param row Row
         * @returns HTML element
         */
        getRowElement(row: IRow): HTMLElement;
        /**
        * Retrieves row element (including wrapper) by specified row index
        *
        * @param row Row
        * @returns HTML element
        */
        getRowElementByIndex(rowDisplayingIndex: number): HTMLElement;
        /**
         * Retrieves data cells for specified column (including wrappers)
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElements(column: IColumn): NodeList;
        /**
         * Retrieves data cells for specified column (including wrappers) by column index
         *
         * @param column Column desired data cells belongs to
         * @returns HTML NodeList containing results
         */
        getColumnCellsElementsByColumnIndex(columnIndex: number): NodeList;
        /**
         * Retrieves data cells for whole row (including wrapper)
         *
         * @param row Row with data cells
         * @returns NodeList containing results
         */
        getRowCellsElements(row: IRow): NodeList;
        /**
         * Retrieves data cells for whole row (including wrapper)
         *
         * @param row Row with data cells
         * @returns NodeList containing results
         */
        getRowCellsElementsByIndex(rowDisplayingIndex: number): NodeList;
        /**
         * Retrieves HTML element for column header (including wrapper)
         *
         * @param header Column header
         * @returns HTML element
         */
        getHeaderElement(header: IColumnHeader): HTMLElement;
        /**
         * Retrieves HTML element for plugin (including wrapper)
         *
         * @param plugin Plugin
         * @returns HTML element
         */
        getPluginElement(plugin: IPlugin): HTMLElement;
        /**
         * Retrieves HTML element for plugin (including wrapper)
         *
         * @param plugin Plugin
         * @returns HTML element
         */
        getPluginElementsByPositionPart(placement: string): NodeList;
        /**
         * Determines if supplied element is table row
         *
         * @param e Testing element
         * @returns {boolean} True when supplied element is row, false otherwise
         */
        isRow(e: HTMLElement): boolean;
        /**
         * Determines if supplied element is table cell
         *
         * @param e Testing element
         * @returns {boolean} True when supplied element is cell, false otherwise
         */
        isCell(e: HTMLElement): boolean;
    }
}
