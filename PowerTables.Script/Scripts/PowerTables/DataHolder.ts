module PowerTables {

    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    export class DataHolder {
        constructor(rawColumnNames: string[], isColumnDateTimeFunc: (s: string) => boolean) {
            this._rawColumnNames = rawColumnNames;
            this._isColumnDateTimeFunc = isColumnDateTimeFunc;
        }

        private _rawColumnNames: string[];
        private _isColumnDateTimeFunc: (s: string) => boolean;

        private _filters: IClientFilter[] = [];

        /**
         * Data that actually is currently displayed in table
         */
        public CurrentlyDisplaying: any[];

        /**
         * Data that was recently loaded from server
         */
        public LastLoaded: any[];

        /**
         * Selector of source data on client-side
         */
        public Selector: IClientTruncator = null;

        /**
         * Registers client filter
         * 
         * @param filter Client filter
         */
        public registerClientFilter(filter: IClientFilter):void {
            this._filters.push(filter);
        }

        /**
        * Parses response from server and turns it to objects array
        */
        public storeResponse(response: IPowerTablesResponse) {
            var data = [];
            var obj = {};
            var currentColIndex = 0;
            var currentCol = this._rawColumnNames[currentColIndex];

            for (var i = 0; i < response.Data.length; i++) {
                if (this._isColumnDateTimeFunc(currentCol)) {
                    if (response.Data[i]) {
                        obj[currentCol] = Date.parse(response.Data[i]);
                    } else {
                        obj[currentCol] = null;
                    }
                } else {
                    obj[currentCol] = response.Data[i];
                }
                currentColIndex++;
                if (currentColIndex >= this._rawColumnNames.length) {
                    currentColIndex = 0;
                    data.push(obj);
                    obj = {};
                }
                currentCol = this._rawColumnNames[currentColIndex];
            }
            this.LastLoaded = data;
        }

        /**
         * Filter recent data and store it to currently displaying data
         * 
         * @param query Table query
         * @returns {} 
         */
        public filterRecentData(query: IQuery) {
            if (this._filters.length === 0) {
                this.CurrentlyDisplaying = this.LastLoaded;
            } else {
                var result = [];
                for (var i = 0; i < this.LastLoaded.length; i++) {
                    var obj = this.LastLoaded[i];
                    var acceptable: boolean = true;
                    for (var j = 0; j < this._filters.length; j++) {
                        var filter = this._filters[j];
                        acceptable = filter.filterPredicate(obj, query);
                        if (!acceptable) break;
                    }
                    if (!acceptable) continue;
                    result.push(obj);
                }
                this.CurrentlyDisplaying = result;
            }

            if (this.Selector) {
                this.CurrentlyDisplaying = this.Selector.selectData(this.CurrentlyDisplaying, query);
            }
        }
    }
} 