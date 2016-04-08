module PowerTables {

    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    export class DataHolder {
        constructor(rawColumnNames: string[], isColumnDateTimeFunc: (s: string) => boolean,events:EventsManager) {
            this._rawColumnNames = rawColumnNames;
            this._isColumnDateTimeFunc = isColumnDateTimeFunc;
            this._events = events;
        }

        private _rawColumnNames: string[];
        private _isColumnDateTimeFunc: (s: string) => boolean;
        private _comparators: { [key: string]: (a: any, b: any) => number } = {};
        private _filters: IClientFilter[] = [];
        private _anyClientFiltration:boolean = false;
        private _events: EventsManager;

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
        public registerClientFilter(filter: IClientFilter): void {
            this._anyClientFiltration = true;
            this._filters.push(filter);
        }

        /**
         * Registers new client ordering comparer function
         * 
         * @param dataField Field for which this comparator is applicable
         * @param comparator Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b
         * @returns {} 
         */
        public registerClientOrdering(dataField: string, comparator: (a: any, b: any) => number): void {
            this._anyClientFiltration = true;
            this._comparators[dataField] = comparator;
        }

        /**
         * Is there any client filtration pending 
         * @returns True if there are any actions to be performed on query after loading, false otherwise 
         */
        public isClientFiltrationPending(): boolean {
            return ((!(!this.Selector)) || this._anyClientFiltration);
        }

        /**
        * Parses response from server and turns it to objects array
        */
        public storeResponse(response: IPowerTablesResponse,clientQuery:IQuery) {
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
            if (this.isClientFiltrationPending() && (!(!clientQuery))) {
                this.filterRecentData(clientQuery);
            }
        }

        /**
         * Filter recent data and store it to currently displaying data
         * 
         * @param query Table query
         * @returns {} 
         */
        public filterRecentData(query: IQuery) {
            if (this.isClientFiltrationPending() && (!(!query))) {
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

                if (query.Orderings) {
                    var sortFn = '';
                    var comparersArg = '';
                    var orderFns = [];

                    for (var orderingKey in query.Orderings) {
                        if (query.Orderings.hasOwnProperty(orderingKey)) {
                            var orderingDirection = query.Orderings[orderingKey];
                            if (orderingDirection === Ordering.Neutral) continue;
                            if (!this._comparators[orderingKey]) continue;
                            var negate = orderingDirection === Ordering.Descending;

                            sortFn += `cc = f${orderFns.length}(a,b); `;
                            comparersArg += `f${orderFns.length},`;

                            orderFns.push(this._comparators[orderingKey]);
                            sortFn += `if (cc!=0) return ${negate ? '-cc' : 'cc'}; `;
                        }
                    }
                    comparersArg = comparersArg.substr(0, comparersArg.length - 1);

                    sortFn = `function(${comparersArg}){ return function (a,b) { var cc = 0; ${sortFn} return 0; } }`;

                    var sortFunction = eval(sortFn).apply(null, orderFns);

                    var ordered = this.CurrentlyDisplaying.sort(sortFunction);
                    this.CurrentlyDisplaying = ordered;
                }

                if (this.Selector) {
                    this.CurrentlyDisplaying = this.Selector.selectData(this.CurrentlyDisplaying, query);
                }
            }
        }
    }
} 