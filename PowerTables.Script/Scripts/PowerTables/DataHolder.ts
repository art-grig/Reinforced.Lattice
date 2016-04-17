﻿module PowerTables {
    import AdjustmentData = PowerTables.Editors.IAdjustmentData; /**
     * Class that is responsible for holding and managing data loaded from server
     */
    export class DataHolder {
        constructor(masterTable: IMasterTable) {
            this._rawColumnNames = masterTable.InstanceManager.getColumnNames();
            this._events = masterTable.Events;
            this._instances = masterTable.InstanceManager;
            this._masterTable = masterTable;
        }

        private _rawColumnNames: string[];
        private _comparators: { [key: string]: (a: any, b: any) => number } = {};
        private _filters: IClientFilter[] = [];
        private _anyClientFiltration: boolean = false;
        private _events: EventsManager;
        private _instances: InstanceManager;
        private _masterTable: IMasterTable;
        
        /**
         * Data that actually is currently displayed in table
         */
        public DisplayedData: any[] = [];

        /**
         * Data that was recently loaded from server
         */
        public StoredData: any[] = [];

        /**
         * Enable query truncation from beginning during executing client queries
         */
        public EnableClientSkip: boolean;

        /**
         * Enable query truncation by data cound during executing client queries
         */
        public EnableClientTake: boolean;

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
            return (this.EnableClientSkip || this.EnableClientTake || this._anyClientFiltration);
        }

        /**
        * Parses response from server and turns it to objects array
        */
        public storeResponse(response: IPowerTablesResponse, clientQuery: IQuery) {
            var data: any[] = [];
            var obj: {} = {};
            var currentColIndex: number = 0;
            var currentCol: string = this._rawColumnNames[currentColIndex];

            for (var i: number = 0; i < response.Data.length; i++) {
                if (this._instances.Columns[currentCol].IsDateTime) {
                    if (response.Data[i]) {
                        obj[currentCol] = this._masterTable.Date.parse(response.Data[i]);
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
            this.StoredData = data;
            this.filterStoredData(clientQuery);
        }

        /**
         * Client query that was used to obtain recent local data set
         */
        public RecentClientQuery: IQuery;

        /**
         * Filters supplied data set using client query 
         * 
         * @param objects Data set
         * @param query Client query
         * @returns {Array} Array of filtered items
         */
        public filterSet(objects: any[], query: IQuery): any[] {
            var result: any[] = [];
            if (this._filters.length !== 0) {
                for (var i: number = 0; i < objects.length; i++) {
                    var obj = objects[i];
                    var acceptable: boolean = true;
                    for (var j: number = 0; j < this._filters.length; j++) {
                        var filter: IClientFilter = this._filters[j];
                        acceptable = filter.filterPredicate(obj, query);
                        if (!acceptable) break;
                    }
                    if (!acceptable) continue;
                    result.push(obj);
                }
                return result;
            }
            return objects;
        }

        /**
        * Orders supplied data set using client query 
        * 
        * @param objects Data set
        * @param query Client query
        * @returns {Array} Array of ordered items
        */
        public orderSet(objects: any[], query: IQuery): any[] {
            if (query.Orderings) {
                var sortFn: string = '';
                var comparersArg: string = '';
                var orderFns: any[] = [];


                for (var i: number = 0; i < this._rawColumnNames.length; i++) {
                    var orderingKey: string = this._rawColumnNames[i];
                    if (query.Orderings.hasOwnProperty(orderingKey)) {
                        var orderingDirection: Ordering = query.Orderings[orderingKey];
                        if (orderingDirection === Ordering.Neutral) continue;
                        if (!this._comparators[orderingKey]) continue;
                        var negate: boolean = orderingDirection === Ordering.Descending;

                        sortFn += `cc=f${orderFns.length}(a,b); `;
                        comparersArg += `f${orderFns.length},`;
                        orderFns.push(this._comparators[orderingKey]);
                        sortFn += `if (cc!==0) return ${negate ? '-cc' : 'cc'}; `;
                    }
                }
                if (sortFn.length === 0) return objects;
                comparersArg = comparersArg.substr(0, comparersArg.length - 1);

                sortFn = `(function(${comparersArg}){ return (function (a,b) { var cc = 0; ${sortFn} return 0; }); })`;
                var sortFunction = eval(sortFn).apply(null, orderFns);
                var ordered: any[] = objects.sort(sortFunction);
                return ordered;
            }
            return objects;
        }

        private _previouslyFiltered: any[];
        private _previouslyOrdered: any[];

        /**
         * Filter recent data and store it to currently displaying data
         * 
         * @param query Table query
         * @returns {} 
         */
        public filterStoredData(query: IQuery) {
            this._events.BeforeClientDataProcessing.invoke(this, query);

            this.DisplayedData = this.StoredData;
            this._previouslyFiltered = this.StoredData;
            this._previouslyOrdered = this.StoredData;

            this.RecentClientQuery = query;

            if (this.isClientFiltrationPending() && (!(!query))) {
                var copy: any[] = this.StoredData.slice();
                var filtered: any[] = this.filterSet(copy, query);
                var ordered: any[] = this.orderSet(filtered, query);
                var selected: any[] = ordered;

                var startingIndex: number = query.Paging.PageIndex * query.Paging.PageSize;
                if (startingIndex > filtered.length) startingIndex = 0;
                var take: number = query.Paging.PageSize;
                if (this.EnableClientSkip && this.EnableClientTake) {
                    if (take === 0) selected = ordered.slice(startingIndex);
                    else selected = ordered.slice(startingIndex, startingIndex + take);
                } else {
                    if (this.EnableClientSkip) {
                        selected = ordered.slice(startingIndex);
                    } else if (this.EnableClientTake) {
                        if (take !== 0) {
                            selected = ordered.slice(0, query.Paging.PageSize);
                        }
                    }
                }

                this._previouslyFiltered = filtered;
                this._previouslyOrdered = ordered;

                this.DisplayedData = selected;
            }

            this._events.AfterClientDataProcessing.invoke(this, {
                Displaying: this.DisplayedData,
                Filtered: this._previouslyFiltered,
                Ordered: this._previouslyOrdered,
                Source: this.StoredData
            });
        }

        /**
         * Filter recent data and store it to currently displaying data 
         * using query that was previously applied to local data         
         */
        public filterStoredDataWithPreviousQuery() {
            this.filterStoredData(this.RecentClientQuery);
        }

        /**
         * Finds data matching predicate among locally stored data
         * 
         * @param predicate Filtering predicate returning true for required objects
         * @returns Array of ILocalLookupResults
         */
        public localLookup(predicate: (object: any) => boolean): ILocalLookupResult[] {
            var result: ILocalLookupResult[] = [];
            for (var i: number = 0; i < this.StoredData.length; i++) {
                if (predicate(this.StoredData[i])) {
                    result.push({
                        DataObject: this.StoredData[i],
                        IsCurrentlyDisplaying: false,
                        LoadedIndex: i,
                        DisplayedIndex: -1
                    });
                }
            }

            for (var j: number = 0; j < result.length; j++) {
                var idx: number = this.DisplayedData.indexOf(result[j].DataObject);
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
        public localLookupDisplayedDataObject(dataObject: any): ILocalLookupResult {
            var index: number = this.DisplayedData.indexOf(dataObject);
            if (index < 0) return null;
            var result: ILocalLookupResult = {
                DataObject: dataObject,
                IsCurrentlyDisplaying: true,
                DisplayedIndex: index,
                LoadedIndex: this.StoredData.indexOf(dataObject)
            };

            return result;
        }

        /**
         * Finds data object among currently displayed and returns ILocalLookupResult 
         * containing also Loaded-set index of this data object
         * 
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        public localLookupStoredDataObject(dataObject: any): ILocalLookupResult {
            var index: number = this.StoredData.indexOf(dataObject);
            if (index < 0) return null;
            var result: ILocalLookupResult = {
                DataObject: dataObject,
                IsCurrentlyDisplaying: true,
                DisplayedIndex: this.DisplayedData.indexOf(dataObject),
                LoadedIndex: index
            };

            return result;
        }

        /**
         * Finds data object among currently displayed and returns ILocalLookupResult 
         * containing also Loaded-set index of this data object
         * 
         * @param index Index of desired data object among locally displaying data
         * @returns ILocalLookupResult
         */
        public localLookupDisplayedData(index: number): ILocalLookupResult {
            if (index < 0) return null;
            if (index > this.DisplayedData.length) return null;
            var result: ILocalLookupResult = {
                DataObject: this.DisplayedData[index],
                IsCurrentlyDisplaying: true,
                DisplayedIndex: index,
                LoadedIndex: this.StoredData.indexOf(this.DisplayedData[index])
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
        public localLookupStoredData(index: number): ILocalLookupResult {
            if (index < 0) return null;
            if (index > this.StoredData.length) return null;
            var result: ILocalLookupResult = {
                DataObject: this.StoredData[index],
                IsCurrentlyDisplaying: true,
                DisplayedIndex: this.DisplayedData.indexOf(this.StoredData[index]),
                LoadedIndex: index
            };

            return result;
        }


        /**
         * Finds data object among recently loaded by primary key and returns ILocalLookupResult 
         * containing also Loaded-set index of this data object
         * 
         * @param dataObject Object to match
         * @returns ILocalLookupResult
         */
        public localLookupPrimaryKey(dataObject: any): ILocalLookupResult {
            var found = null;
            var foundIdx = 0;
            for (var i = 0; i < this.StoredData.length; i++) {
                if (this._masterTable.InstanceManager.DataObjectComparisonFunction(dataObject, this.StoredData[i])) {
                    found = this.StoredData[i];
                    foundIdx = i;
                    break;
                }
            }
            var result: ILocalLookupResult;
            if (found == null) {
                result = {
                    DataObject: null,
                    IsCurrentlyDisplaying: false,
                    DisplayedIndex: -1,
                    LoadedIndex: -1
                };
            } else {
                var cdisp = this.DisplayedData.indexOf(found);
                result = {
                    DataObject: found,
                    IsCurrentlyDisplaying: cdisp > -1,
                    DisplayedIndex: cdisp,
                    LoadedIndex: foundIdx
                };
            }
            return result;
        }

        public copyData(source: any, target: any): string[] {
            var modColumns = [];
            for (var cd in source) {
                if (source.hasOwnProperty(cd)) {
                    if (target[cd] !== source[cd]) {
                        modColumns.push(cd);
                        target[cd] = source[cd];
                    }
                }
            }
            return modColumns;
        }

        public proceedAdjustments(adjustments: AdjustmentData): IAdjustmentResult {
            var needRefilter = false;
            var redrawVisibles = [];
            var touchedData = [];
            var touchedColumns = [];
            var added = [];

            for (var i = 0; i < adjustments.Updates.length; i++) {
                var update = this.localLookupPrimaryKey(adjustments.Updates[i]);
                if (update.LoadedIndex < 0) {
                    if (this.StoredData.length > 0) {
                        this.StoredData.push(adjustments.Updates[i]);
                        added.push(adjustments.Updates[i]);
                        needRefilter = true;
                    }
                } else {
                    touchedColumns.push(this.copyData(adjustments.Updates[i], update.DataObject));
                    touchedData.push(update.DataObject);
                    if (update.DisplayedIndex > 0) {
                        redrawVisibles.push(update.DataObject);
                    } else {
                        needRefilter = true;
                    }
                }
            }

            for (var j = 0; j < adjustments.Removals.length; j++) {
                var lookup = this.localLookupPrimaryKey(adjustments.Removals[j]);
                if (lookup.LoadedIndex > -1) {
                    this.StoredData.splice(lookup.LoadedIndex, 1);
                    needRefilter = true;
                }
            }
            if (needRefilter) {
                this.filterStoredDataWithPreviousQuery();
                redrawVisibles = [];
                for (var k = 0; k < added.length; k++) {
                    if (this.DisplayedData.indexOf(added[k]) > -1) redrawVisibles.push(added[k]);
                }

                for (var l = 0; l < touchedData.length; l++) {
                    if (this.DisplayedData.indexOf(touchedData[l]) > -1) redrawVisibles.push(touchedData[l]);
                }
            }
            return {
                NeedRedrawAllVisible: needRefilter,
                VisiblesToRedraw: redrawVisibles,
                AddedData: added,
                TouchedData: touchedData,
                TouchedColumns: touchedColumns
            }
        }
    }

    export interface IAdjustmentResult {
        NeedRedrawAllVisible:boolean;
        VisiblesToRedraw: any[];
        AddedData:any[];
        TouchedData: any[];
        TouchedColumns:string[][];
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