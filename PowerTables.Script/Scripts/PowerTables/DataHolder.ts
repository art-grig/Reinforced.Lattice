module PowerTables {

    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    export class DataHolder {
        constructor(rawColumnNames: string[],
            isColumnDateTimeFunc: (s: string) => boolean,
            events: EventsManager,
            instances: InstanceManager) {
            this._rawColumnNames = rawColumnNames;
            this._isColumnDateTimeFunc = isColumnDateTimeFunc;
            this._events = events;
            this._instances = instances;
        }

        private _rawColumnNames: string[];
        private _isColumnDateTimeFunc: (s: string) => boolean;
        private _comparators: { [key: string]: (a: any, b: any) => number } = {};
        private _filters: IClientFilter[] = [];
        private _anyClientFiltration: boolean = false;
        private _events: EventsManager;
        private _instances: InstanceManager;

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
        public storeResponse(response: IPowerTablesResponse, clientQuery: IQuery) {
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
            this.filterRecentData(clientQuery);
        }

        private _recentClientQuery: IQuery;

        private filterSet(objects: any[], query: IQuery): any[] {
            var result = [];
            if (this._filters.length !== 0) {
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
                return result;
            }
            return null;
        }

        private orderSet(objects: any[], query: IQuery): any[] {
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
                var ordered = objects.sort(sortFunction);
                return ordered;
            }
            return null;
        }

        /**
         * Filter recent data and store it to currently displaying data
         * 
         * @param query Table query
         * @returns {} 
         */
        public filterRecentData(query: IQuery) {
            this.CurrentlyDisplaying = this.LastLoaded;
            this._recentClientQuery = query;

            if (this.isClientFiltrationPending() && (!(!query))) {
                var filtered = this.filterSet(this.CurrentlyDisplaying, query);
                if (filtered) this.CurrentlyDisplaying = filtered;
                var ordered = this.orderSet(this.CurrentlyDisplaying, query);
                if (ordered) this.CurrentlyDisplaying = ordered;

                if (this.Selector) {
                    this.CurrentlyDisplaying = this.Selector.selectData(this.CurrentlyDisplaying, query);
                }
            }
        }

        /**
         * Finds data matching predicate among locally stored data
         * 
         * @param predicate Filtering predicate returning true for required objects
         * @returns Array of ILocalLookupResults
         */
        public localLookup(predicate: (object: any) => boolean): ILocalLookupResult[] {
            var result: ILocalLookupResult[] = [];
            for (var i = 0; i < this.LastLoaded.length; i++) {
                if (predicate(this.LastLoaded[i])) {
                    result.push({
                        DataObject: this.LastLoaded[i],
                        IsCurrentlyDisplaying: false,
                        LoadedIndex: i,
                        DisplayedIndex: -1
                    });
                }
            }

            for (var j = 0; j < result.length; j++) {
                var idx = this.CurrentlyDisplaying.indexOf(result[j].DataObject);
                if (idx >= 0) {
                    result[j].IsCurrentlyDisplaying = true;
                    result[j].DisplayedIndex = idx;
                }
            }
            return result;
        }

        /**
         * Finds data object among currently displayed and returns ILocalLookupResult 
         * containing also Loaded-set index of this data object
         * 
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        public localLookupCurrentlyDisplaying(index: number): ILocalLookupResult {
            if (index < 0) return null;
            if (index > this.CurrentlyDisplaying.length) return null;
            var result: ILocalLookupResult = {
                DataObject: this.CurrentlyDisplaying[index],
                IsCurrentlyDisplaying: true,
                DisplayedIndex: index,
                LoadedIndex: this.LastLoaded.indexOf(this.CurrentlyDisplaying[index])
            };

            return result;
        }

        /**
         * Finds data object among recently loaded and returns ILocalLookupResult 
         * containing also Loaded-set index of this data object
         * 
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        public localLookupLoaded(index: number): ILocalLookupResult {
            if (index < 0) return null;
            if (index > this.LastLoaded.length) return null;
            var result: ILocalLookupResult = {
                DataObject: this.LastLoaded[index],
                IsCurrentlyDisplaying: true,
                DisplayedIndex: this.CurrentlyDisplaying.indexOf(this.LastLoaded[index]),
                LoadedIndex: index
            };

            return result;
        }
    }

    /**
     * Result of searching among local data
     */
    export interface ILocalLookupResult {
        /**
         * Data object reference itself
         */
        DataObject: any;
        
        /**
         * Is data object currently displaying or not
         */
        IsCurrentlyDisplaying: boolean;

        /**
         * Row index among loaded data
         */
        LoadedIndex: number;

        /**
         * Row index among displayed data
         */
        DisplayedIndex: number;
    }
} 