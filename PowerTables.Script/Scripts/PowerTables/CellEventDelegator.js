var PowerTables;
(function (PowerTables) {
    /**
     * Component responsible for handling of user events raised on table cells
     */
    var CellEventDelegator = (function () {
        function CellEventDelegator(bodyRootElement) {
            this._bodyRootElement = bodyRootElement;
        }
        return CellEventDelegator;
    })();
    PowerTables.CellEventDelegator = CellEventDelegator;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=CellEventDelegator.js.map