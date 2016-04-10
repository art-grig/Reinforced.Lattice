var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        /**
         * This module allows you to locate particular elements in table's DOM
         */
        var DOMLocator = (function () {
            function DOMLocator(bodyElement, rootElement, rootId) {
                this._bodyElement = bodyElement;
                this._rootElement = rootElement;
                this._rootIdPrefix = "#" + rootId;
            }
            /**
             * Retrieves cell element by cell object
             *
             * @param cell Cell element
             * @returns {HTMLElement} Element containing cell (with wrapper)
             */
            DOMLocator.prototype.getCellElement = function (cell) {
                var track = PowerTables.TrackHelper.getCellTrack(cell);
                return this._bodyElement.querySelector(this._rootIdPrefix + " [data-track=\"" + track + "\"]");
            };
            /**
             * Retrieves cell element using supplied coordinates
             *
             * @param cell Cell element
             * @returns {HTMLElement} Element containing cell (with wrapper)
             */
            DOMLocator.prototype.getCellElementByIndex = function (rowDisplayIndex, columnIndex) {
                var track = PowerTables.TrackHelper.getCellTrackByIndexes(rowDisplayIndex, columnIndex);
                return this._bodyElement.querySelector(this._rootIdPrefix + " [data-track=\"" + track + "\"]");
            };
            /**
             * Retrieves row element (including wrapper)
             *
             * @param row Row
             * @returns HTML element
             */
            DOMLocator.prototype.getRowElement = function (row) {
                var track = PowerTables.TrackHelper.getRowTrack(row);
                return this._bodyElement.querySelector(this._rootIdPrefix + " [data-track=\"" + track + "\"]");
            };
            /**
            * Retrieves row element (including wrapper) by specified row index
            *
            * @param row Row
            * @returns HTML element
            */
            DOMLocator.prototype.getRowElementByIndex = function (rowDisplayingIndex) {
                var track = PowerTables.TrackHelper.getRowTrackByIndex(rowDisplayingIndex);
                return this._bodyElement.querySelector(this._rootIdPrefix + " [data-track=\"" + track + "\"]");
            };
            /**
             * Retrieves data cells for specified column (including wrappers)
             *
             * @param column Column desired data cells belongs to
             * @returns HTML NodeList containing results
             */
            DOMLocator.prototype.getColumnCellsElements = function (column) {
                var colIdx = column.MasterTable.InstanceManager.getUiColumnNames().indexOf(column.RawName);
                return this._bodyElement.querySelectorAll(this._rootIdPrefix + " [data-track$=\"-c" + colIdx + "\"]");
            };
            /**
             * Retrieves data cells for specified column (including wrappers) by column index
             *
             * @param column Column desired data cells belongs to
             * @returns HTML NodeList containing results
             */
            DOMLocator.prototype.getColumnCellsElementsByColumnIndex = function (columnIndex) {
                return this._bodyElement.querySelectorAll(this._rootIdPrefix + " [data-track$=\"-c" + columnIndex + "\"]");
            };
            /**
             * Retrieves data cells for whole row (including wrapper)
             *
             * @param row Row with data cells
             * @returns NodeList containing results
             */
            DOMLocator.prototype.getRowCellsElements = function (row) {
                return this.getRowCellsElementsByIndex(row.Index);
            };
            /**
             * Retrieves data cells for whole row (including wrapper)
             *
             * @param row Row with data cells
             * @returns NodeList containing results
             */
            DOMLocator.prototype.getRowCellsElementsByIndex = function (rowDisplayingIndex) {
                return this._bodyElement.querySelectorAll(this._rootIdPrefix + " [data-track^=\"c-r" + rowDisplayingIndex + "-\"]");
            };
            /**
             * Retrieves HTML element for column header (including wrapper)
             *
             * @param header Column header
             * @returns HTML element
             */
            DOMLocator.prototype.getHeaderElement = function (header) {
                var track = PowerTables.TrackHelper.getHeaderTrack(header);
                return this._rootElement.querySelector(this._rootIdPrefix + " [data-track=\"" + track + "\"]");
            };
            /**
             * Retrieves HTML element for plugin (including wrapper)
             *
             * @param plugin Plugin
             * @returns HTML element
             */
            DOMLocator.prototype.getPluginElement = function (plugin) {
                var track = PowerTables.TrackHelper.getPluginTrack(plugin);
                return this._rootElement.querySelector(this._rootIdPrefix + " [data-track=\"" + track + "\"]");
            };
            /**
             * Determines if supplied element is table row
             *
             * @param e Testing element
             * @returns {boolean} True when supplied element is row, false otherwise
             */
            DOMLocator.prototype.isRow = function (e) {
                if (!e)
                    return false;
                if (!e.getAttribute)
                    return false;
                var trk = e.getAttribute('data-track');
                return (trk.charAt(0) === 'r') && (trk.charAt(1) === '-');
            };
            /**
             * Determines if supplied element is table cell
             *
             * @param e Testing element
             * @returns {boolean} True when supplied element is cell, false otherwise
             */
            DOMLocator.prototype.isCell = function (e) {
                if (!e)
                    return false;
                if (!e.getAttribute)
                    return false;
                var trk = e.getAttribute('data-track');
                return (trk.charAt(0) === 'c')
                    && (trk.charAt(1) === '-')
                    && (trk.charAt(2) === 'r');
            };
            return DOMLocator;
        })();
        Rendering.DOMLocator = DOMLocator;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=DOMLocator.js.map