var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        var TrackHelper = (function () {
            function TrackHelper() {
            }
            TrackHelper.getCellTrack = function (cell) {
                var colIdx = cell.Column.MasterTable.getColumnNames().indexOf(cell.Column.RawName);
                var rowIdx = cell.Row.Index;
                return "c-r" + rowIdx + "-c" + colIdx;
            };
            TrackHelper.getPluginTrack = function (plugin) {
                return "p-" + plugin.PluginLocation;
            };
            TrackHelper.getHeaderTrack = function (header) {
                return "h-" + header.Column.RawName;
            };
            TrackHelper.getRowTrack = function (row) {
                return "r-" + row.Index;
            };
            TrackHelper.getCellElement = function (body, cell) {
                var track = this.getCellTrack(cell);
                return body.querySelector("[data-track=\"" + track + "\"]");
            };
            TrackHelper.getRowElement = function (body, row) {
                var track = this.getRowTrack(row);
                return body.querySelector("[data-track=\"" + track + "\"]");
            };
            TrackHelper.getColumnCellsElements = function (body, column) {
                var colIdx = column.MasterTable.getColumnNames().indexOf(column.RawName);
                return body.querySelectorAll("[data-track$=\"-c" + colIdx + "\"]");
            };
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
