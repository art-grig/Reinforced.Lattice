var PowerTables;
(function (PowerTables) {
    /**
     * This enumeration distinguishes which way
     * underlying query will be used
     */
    (function (QueryScope) {
        /**
         * Mentioned query will be sent to server to obtain
         * data (probably) for further local filtration.
         * All locally filtered fields should be excluded from
         * underlying query
         */
        QueryScope[QueryScope["Server"] = 0] = "Server";
        /**
         * Mentioned query will be used for local data filtration.
         * To gain performance, please exclude all data settings that were
         * applied during server request
         */
        QueryScope[QueryScope["Client"] = 1] = "Client";
        /**
         * This query should contain both data for client and server filtering.
         * Transboundary queries are used to obtain query settings
         * that will be used on server side to retrieve data set that
         * will be used for server command handling, so server needs all filtering settings
         */
        QueryScope[QueryScope["Transboundary"] = 2] = "Transboundary";
    })(PowerTables.QueryScope || (PowerTables.QueryScope = {}));
    var QueryScope = PowerTables.QueryScope;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=CoreInterfaces.js.map