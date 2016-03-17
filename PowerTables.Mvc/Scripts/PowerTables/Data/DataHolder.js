var PowerTables;
(function (PowerTables) {
    var DataHolder = (function () {
        function DataHolder(table) {
            this._table = table;
            this.Rows = [];
        }
        DataHolder.prototype.storeResponse = function (response, data) {
            this.CurrentPageIndex = response.PageIndex;
            this.CurrentTotalResultsCount = response.ResultsCount;
            this.CurrentData = data;
            this.Rows = [];
        };
        DataHolder.prototype.storeRow = function (row) {
            this.Rows.push(row);
        };
        return DataHolder;
    })();
    PowerTables.DataHolder = DataHolder;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=DataHolder.js.map