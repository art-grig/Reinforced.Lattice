declare module PowerTables {
    /**
     * Component that is responsible for querying server
     */
    class Loader {
        constructor(staticData: any, operationalAjaxUrl: string, masterTable: IMasterTable);
        private _queryPartProviders;
        private _previousRequest;
        private _staticData;
        private _operationalAjaxUrl;
        private _events;
        private _dataHolder;
        private _isFirstTimeLoading;
        private _masterTable;
        /**
         * Registers new query part provider to be used while collecting
         * query data before sending it to server.
         *
         * @param provider instance implementing IQueryPartProvider interface
         * @returns {}
         */
        registerQueryPartProvider(provider: IQueryPartProvider): void;
        private gatherQuery(queryScope);
        private getXmlHttp();
        private _previousQueryString;
        private checkError(json, data, req);
        private checkMessage(json);
        private checkEditResult(json, data, req);
        private handleRegularJsonResponse(req, data, clientQuery, callback, errorCallback);
        private handleDeferredResponse(req, data, callback);
        private doServerQuery(data, clientQuery, callback, errorCallback?);
        /**
         * Sends specified request to server and lets table handle it.
         * Always use this method to invoke table's server functionality because this method
         * correctly rises all events, handles errors etc
         *
         * @param command Query command
         * @param callback Callback that will be invoked after data received
         * @param queryModifier Inline query modifier for in-place query modification
         * @param errorCallback Will be called if error occures
         * @returns {}
         */
        requestServer(command: string, callback: (data: any) => void, queryModifier?: (a: IQuery) => IQuery, errorCallback?: (data: any) => void, force?: boolean): void;
    }
}
