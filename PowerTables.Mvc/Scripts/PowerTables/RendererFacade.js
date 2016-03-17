var PowerTables;
(function (PowerTables) {
    var RendererFacade = (function () {
        function RendererFacade() {
        }
        RendererFacade.prototype.renderTableHeader = function () {
            return '';
        };
        RendererFacade.prototype.renderDataRow = function (dataObject) {
            return '';
        };
        RendererFacade.prototype.renderEmptyRow = function () {
            return '';
        };
        RendererFacade.prototype.renderColumnHeader = function (columnName) {
            return '';
        };
        RendererFacade.prototype.renderColumnFilter = function (columnName) {
            return '';
        };
        RendererFacade.prototype.renderCell = function (columnName, dataObject) {
            return '';
        };
        RendererFacade.prototype.renderLoadingInicator = function () {
            return '';
        };
        return RendererFacade;
    })();
    PowerTables.RendererFacade = RendererFacade;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=RendererFacade.js.map