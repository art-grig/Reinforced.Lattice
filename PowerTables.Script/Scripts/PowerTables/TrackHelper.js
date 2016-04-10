var PowerTables;
(function (PowerTables) {
    /**
    * Helper class for producing track ids
    */
    var TrackHelper = (function () {
        function TrackHelper() {
        }
        /**
         * Returns string track ID for cell
         */
        TrackHelper.getCellTrack = function (cell) {
            var colIdx = cell.Column.MasterTable.InstanceManager.getUiColumnNames().indexOf(cell.Column.RawName);
            var rowIdx = cell.Row.Index;
            return TrackHelper.getCellTrackByIndexes(rowIdx, colIdx);
        };
        /**
         * Returns string track ID for cell
         */
        TrackHelper.getCellTrackByIndexes = function (rowIndex, columnIndex) {
            return "c-r" + rowIndex + "-c" + columnIndex;
        };
        /**
         * Returns string track ID for plugin
         */
        TrackHelper.getPluginTrack = function (plugin) {
            return "p-" + plugin.PluginLocation;
        };
        /**
         * Returns string track ID for plugin
         */
        TrackHelper.getPluginTrackByLocation = function (pluginLocation) {
            return "p-" + pluginLocation;
        };
        /**
         * Returns string track ID for header
         */
        TrackHelper.getHeaderTrack = function (header) {
            return "h-" + header.Column.RawName;
        };
        /**
         * Returns string track ID for header
         */
        TrackHelper.getHeaderTrackByColumnName = function (columnName) {
            return "h-" + columnName;
        };
        /**
         * Returns string track ID for row
         */
        TrackHelper.getRowTrack = function (row) {
            return this.getRowTrackByIndex(row.Index);
        };
        /**
         * Returns string track ID for row
         */
        TrackHelper.getRowTrackByIndex = function (index) {
            return "r-" + index;
        };
        /**
         * Parses cell track to retrieve column and row index
         *
         * @param e HTML element containing cell with wrapper
         * @returns {ICellLocation} Cell location
         */
        TrackHelper.getCellLocation = function (e) {
            if (!e)
                return null;
            if (!e.getAttribute)
                return null;
            var trk = e.getAttribute('data-track').substring(2).split('-c');
            return {
                RowIndex: parseInt(trk[0]),
                ColumnIndex: parseInt(trk[1])
            };
        };
        /**
         * Parses row track to retrieve row index
         *
         * @param e HTML element containing row with wrapper
         * @returns {number} Row index
         */
        TrackHelper.getRowIndex = function (e) {
            if (!e)
                return null;
            if (!e.getAttribute)
                return null;
            var trk = e.getAttribute('data-track').substring(1);
            return parseInt(trk);
        };
        return TrackHelper;
    })();
    PowerTables.TrackHelper = TrackHelper;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=TrackHelper.js.map