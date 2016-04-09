var PowerTables;
(function (PowerTables) {
    var CellEventDelegator = (function () {
        function CellEventDelegator(bodyRootElement) {
            this._bodyRootElement = bodyRootElement;
        }
        return CellEventDelegator;
    })();
    PowerTables.CellEventDelegator = CellEventDelegator;
})(PowerTables || (PowerTables = {}));
