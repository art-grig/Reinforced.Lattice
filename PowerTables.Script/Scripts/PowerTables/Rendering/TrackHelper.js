var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        /**
        * Helper class for producing track ids
        */
        var TrackHelper = (function () {
            function TrackHelper() {
            }
            /*
             * Returns string track ID for cell
             */
            TrackHelper.getCellTrack = function (cell) {
                var colIdx = cell.Column.MasterTable.getColumnNames().indexOf(cell.Column.RawName);
                var rowIdx = cell.Row.Index;
                return "c-r" + rowIdx + "-c" + colIdx;
            };
            /*
             * Returns string track ID for plugin
             */
            TrackHelper.getPluginTrack = function (plugin) {
                return "p-" + plugin.PluginLocation; //todo
            };
            /*
             * Returns string track ID for header
             */
            TrackHelper.getHeaderTrack = function (header) {
                return "h-" + header.Column.RawName;
            };
            /*
             * Returns string track ID for row
             */
            TrackHelper.getRowTrack = function (row) {
                return "r-" + row.Index;
            };
            /*
             * Retrieves cell element from supplied body
             */
            TrackHelper.getCellElement = function (body, cell) {
                var track = this.getCellTrack(cell);
                return body.querySelector("[data-track=\"" + track + "\"]");
            };
            /*
             * Retrieves row element from supplied body
             */
            TrackHelper.getRowElement = function (body, row) {
                var track = this.getRowTrack(row);
                return body.querySelector("[data-track=\"" + track + "\"]");
            };
            /*
             * Retrieves cells for each column
             */
            TrackHelper.getColumnCellsElements = function (body, column) {
                var colIdx = column.MasterTable.getColumnNames().indexOf(column.RawName);
                return body.querySelectorAll("[data-track$=\"-c" + colIdx + "\"]");
            };
            /*
             * Retrieves cells for each column
             */
            TrackHelper.getRowCellsElements = function (body, row) {
                return body.querySelectorAll("[data-track^=\"c-r" + row.Index + "-\"]");
            };
            TrackHelper.getHeaderElement = function (table, header) {
                var track = this.getHeaderTrack(header);
                return table.querySelector("[data-track=\"" + track + "\"]");
            };
            TrackHelper.getPluginElement = function (table, plugin) {
                var track = this.getPluginTrack(plugin);
                return table.querySelector("[data-track=\"" + track + "\"]");
            };
            return TrackHelper;
        })();
        Rendering.TrackHelper = TrackHelper;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=TrackHelper.js.map