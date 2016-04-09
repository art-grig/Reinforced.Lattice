var PowerTables;
(function (PowerTables) {
    (function (QueryScope) {
        QueryScope[QueryScope["Server"] = 0] = "Server";
        QueryScope[QueryScope["Client"] = 1] = "Client";
        QueryScope[QueryScope["Transboundary"] = 2] = "Transboundary";
    })(PowerTables.QueryScope || (PowerTables.QueryScope = {}));
    var QueryScope = PowerTables.QueryScope;
})(PowerTables || (PowerTables = {}));
