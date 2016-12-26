module PowerTables.Services {
    /**
     * Class that is responsible for holding and managing data loaded from server
     */
    export class DataHolderService {
        constructor(masterTable: IMasterTable) {
            this._rawColumnNames = masterTable.InstanceManager.getColumnNames();
            this._events = masterTable.Events;
            this._instances = masterTable.InstanceManager;
            this._masterTable = masterTable;
            for (var ck in masterTable.InstanceManager.Columns) {
                var col = masterTable.InstanceManager.Columns[ck];
                if (col.Configuration.ClientValueFunction != null && col.Configuration.ClientValueFunction != undefined) {
                    this._clientValueFunction[col.RawName] = col.Configuration.ClientValueFunction;
                }
            }
            this._configuration = masterTable.InstanceManager.Configuration;
            this.compileComparisonFunction();
        }

        private _configuration: PowerTables.Configuration.Json.ITableConfiguration;

        private _hasPrimaryKey: boolean;

        private _rawColumnNames: string[];
        private _comparators: { [key: string]: (a: any, b: any) => number } = {};
        private _filters: IClientFilter[] = [];
        private _anyClientFiltration: boolean = false;
        private _events: PowerTables.Services.EventsService;
        private _instances: PowerTables.Services.InstanceManagerService;
        private _masterTable: IMasterTable;
        private _clientValueFunction: { [key: string]: (dataObject: any) => any } = {}

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

        public getClientFilters(): IClientFilter[] {
            return this._filters;
        }

        public clearClientFilters() {
            this._anyClientFiltration = false;
            this._filters = [];
        }

        private compileComparisonFunction() {
            if ((!this._configuration.KeyFields) || (this._configuration.KeyFields.length === 0)) {
                this.DataObjectComparisonFunction = <any>(function () {
                    throw Error('You must specify key fields for table row to use current setup. Please call .PrimaryKey on configuration object and specify set of columns exposing primary key.');
                });
                this.PrimaryKeyFunction = <any>(function () {
                    throw Error('You must specify key fields for table row to use current setup. Please call .PrimaryKey on configuration object and specify set of columns exposing primary key.');
                });
                this._hasPrimaryKey = false;
                return;
            }
            if (this._configuration.KeyFields.length === 0) return;
            if (!window['___ltcstrh']) {
                window['___ltcstrh'] = function(x:String) {
                    if (x == null) return '';
                    var r = '';
                    for (var i = 0; i < x.length; i++) {
                        if (x[i] === '\\') r += '\\\\';
                        else if (x[i] === ':') r += '\\:';
                        else r += x[i];
                    }
                    return r;
                }
            }
            var fields = [];
            for (var i = 0; i < this._configuration.KeyFields.length; i++) {
                var field = this._configuration.KeyFields[i];
                if (this._instances.Columns[this._configuration.KeyFields[i]].IsDateTime) {
                    fields.push(`((x.${field})==null?'':((x.${field}).getTime()))`);
                } else {
                    if (this._instances.Columns[this._configuration.KeyFields[i]].IsBoolean) {
                        fields.push(`((x.${field})==null?'':(x.${field}?'1':'0'))`);
                    }
                    else if (this._instances.Columns[this._configuration.KeyFields[i]].IsString) {

                        fields.push(`(window.___ltcstrh(x.${field}))`);
                    } else {
                        fields.push(`((x.${field})==null?'':(x.${field}.toString()))`);
                    }
                }
            }
            var keyStr = fields.join('+":"+');
            this.DataObjectComparisonFunction = function (x, y) { return x['__key'] === y['__key']; };
            this.PrimaryKeyFunction = eval(`(function(x) { return (${keyStr}) + ':'; })`);
            this._hasPrimaryKey = true;
        }

        public PrimaryKeyFunction: (x: any) => string;

        /**
         * Local objects comparison function based on key fields
         * 
         * @param x Local data object 1
         * @param y Local data object 2
         * @returns {Boolean} True if objects are equal with primary key
         */
        public DataObjectComparisonFunction: (x: any, y: any) => boolean;


        /**
         * Registers new client ordering comparer function
         * 
         * @param dataField Field for which this comparator is applicable
         * @param comparator Comparator fn that should return 0 if entries are equal, -1 if a<b, +1 if a>b
         * @returns {} 
         */
        public registerClientOrdering(dataField: string, comparator: (a: any, b: any) => number, mandatory: boolean = false): void {
            this._anyClientFiltration = true;
            this._comparators[dataField] = comparator;
            if (mandatory) this._manadatoryOrderings.push(dataField);
        }

        private _manadatoryOrderings: string[] = [];

        private isClientFiltrationPending(): boolean {
            return (this.EnableClientSkip || this.EnableClientTake || this._anyClientFiltration);
        }

        public deserializeData(source: any[]): any[] {
            var data: any[] = [];
            var obj: {} = {};
            var currentColIndex: number = this.getNextNonSpecialColumn(-1);
            var currentCol: string = this._rawColumnNames[currentColIndex];

            for (var i: number = 0; i < source.length; i++) {
                if (this._instances.Columns[currentCol].IsDateTime) {
                    if (source[i]) {
                        obj[currentCol] = this._masterTable.Date.parse(source[i]);
                    } else {
                        obj[currentCol] = null;
                    }
                } else {
                    obj[currentCol] = source[i];
                }

                currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                if (currentColIndex === -1) {
                    currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                    for (var ck in this._clientValueFunction) {
                        obj[ck] = this._clientValueFunction[ck](obj);
                    }
                    data.push(obj);
                    if (this._hasPrimaryKey) {
                        obj['__key'] = this.PrimaryKeyFunction(obj);
                        if (this._storedDataCache.hasOwnProperty(obj['__key'])) {
                            obj['__i'] = this._storedDataCache[obj['__key']]['__i'];
                        }
                    }
                    if (!obj.hasOwnProperty('__i')) {
                        obj['__i'] = this.StoredData.length - 1;
                    }
                    obj = {};
                }
                currentCol = this._rawColumnNames[currentColIndex];
            }
            return data;
        }

        private getNextNonSpecialColumn(currentColIndex: number): number {
            do {
                currentColIndex++;
                if (currentColIndex >= this._rawColumnNames.length) {
                    return -1;
                }
            } while (this._instances.Columns[this._rawColumnNames[currentColIndex]].Configuration.IsSpecial);
            return currentColIndex;
        }

        /**
        * Parses response from server and turns it to objects array
        */
        public storeResponse(response: IPowerTablesResponse, clientQuery: IQuery) {
            var data: any[] = [];
            var obj: {} = {};
            var currentColIndex: number = this.getNextNonSpecialColumn(-1);
            var currentCol: string = this._rawColumnNames[currentColIndex];
            this._storedDataCache = {};

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

                currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                if (currentColIndex === -1) {
                    currentColIndex = this.getNextNonSpecialColumn(currentColIndex);
                    for (var ck in this._clientValueFunction) {
                        obj[ck] = this._clientValueFunction[ck](obj);
                    }
                    data.push(obj);
                    if (this._hasPrimaryKey) {
                        obj['__key'] = this.PrimaryKeyFunction(obj);
                        this._storedDataCache[obj['__key']] = obj; // line that makes difference
                    }
                    obj['__i'] = data.length - 1;
                    obj = {};
                }
                currentCol = this._rawColumnNames[currentColIndex];
            }
            this.StoredData = data;
            this.filterStoredData(clientQuery);
            this.updateStats(response.ResultsCount);
        }

        private _storedDataCache: { [_: string]: any };

        //#region Client processing

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
                    if (query.Orderings.hasOwnProperty(orderingKey) || (this._manadatoryOrderings.indexOf(orderingKey) >= 0)) {
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

        private skipTakeSet(ordered: any[], query: IQuery): any[] {
            var selected = ordered;

            var startingIndex: number = query.Paging.PageIndex * query.Paging.PageSize;
            if (startingIndex > ordered.length) startingIndex = 0;
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
            return selected;
        }

        /**
         * Part of data currently displayed without ordering and paging
         */
        public Filtered: any[];

        /**
         * Part of data currently displayed without paging
         */
        public Ordered: any[];

        /**
         * Filter recent data and store it to currently displaying data
         * 
         * @param query Table query
         * @returns {} 
         */
        public filterStoredData(query: IQuery) {
            this._events.ClientDataProcessing.invokeBefore(this, query);

            this.DisplayedData = this.StoredData;
            this.Filtered = this.StoredData;
            this.Ordered = this.StoredData;

            this.RecentClientQuery = query;

            if (this.isClientFiltrationPending() && (!(!query))) {
                var copy: any[] = this.StoredData.slice();
                var filtered: any[] = this.filterSet(copy, query);
                var ordered: any[] = this.orderSet(filtered, query);
                var selected: any[] = this.skipTakeSet(ordered, query);

                this.Filtered = filtered;
                this.Ordered = ordered;
                this.DisplayedData = selected;
                
            }
            this.updateStats();

            this._events.ClientDataProcessing.invokeAfter(this, {
                Displaying: this.DisplayedData,
                Filtered: this.Filtered,
                Ordered: this.Ordered,
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

        //#endregion

        //#region Lookups

        /**
         * Finds data matching predicate among locally stored data
         * 
         * @param predicate Filtering predicate returning true for required objects
         * @returns Array of ILocalLookupResults
         */
        public localLookup(predicate: (object: any) => boolean, setToLookup: any[] = this.StoredData): ILocalLookupResult[] {
            var result: ILocalLookupResult[] = [];
            for (var i: number = 0; i < setToLookup.length; i++) {
                if (predicate(setToLookup[i])) {
                    result.push({
                        DataObject: setToLookup[i],
                        IsCurrentlyDisplaying: false,
                        LoadedIndex: setToLookup[i]['__i'],
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
                LoadedIndex: dataObject['__i']
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
                LoadedIndex: this.DisplayedData[index]['__i']
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

        public getByPrimaryKeyObject(primaryKeyPart: any): any {
            return this._storedDataCache[this.PrimaryKeyFunction(primaryKeyPart)];
        }

        public getByPrimaryKey(primaryKey: string): any {
            return this._storedDataCache[primaryKey];
        }


        /**
         * Finds data object among recently loaded by primary key and returns ILocalLookupResult 
         * containing also Loaded-set index of this data object
         * 
         * @param dataObject Object to match
         * @returns ILocalLookupResult
         */
        public localLookupPrimaryKey(dataObject: any, setToLookup: any[] = this.StoredData): ILocalLookupResult {
            var found = null;
            
            var nullResult = {
                DataObject: null,
                IsCurrentlyDisplaying: false,
                DisplayedIndex: -1,
                LoadedIndex: -1
            };
            if (!this._hasPrimaryKey) return nullResult;
            var pk = this.PrimaryKeyFunction(dataObject);
            if (!this._storedDataCache.hasOwnProperty(pk)) return nullResult;

            found = this._storedDataCache[pk];
            var cdisp = this.DisplayedData.indexOf(found);
            return {
                DataObject: found,
                IsCurrentlyDisplaying: cdisp > -1,
                DisplayedIndex: cdisp,
                LoadedIndex: found['__i']
            };
        }

        //#endregion

        //#region Adjustments

        private copyData(source: any, target: any): string[] {
            var modColumns = [];
            for (var cd in this._instances.Columns) {
                if (this._instances.Columns[cd].Configuration.IsSpecial) continue;
                if (source.hasOwnProperty(cd)) {
                    var src = source[cd];
                    var trg = target[cd];
                    if (this._instances.Columns[cd].IsDateTime) {
                        src = (src == null) ? null : src.getTime();
                        trg = (trg == null) ? null : trg.getTime();
                    }
                    if (src !== trg) {
                        modColumns.push(cd);
                        target[cd] = source[cd];
                    }
                }
            }
            return modColumns;
        }

        public defaultObject(): any {
            var def = {};
            for (var i = 0; i < this._rawColumnNames.length; i++) {
                var col = this._masterTable.InstanceManager.Columns[this._rawColumnNames[i]];
                if (col.IsInteger || col.IsFloat) def[col.RawName] = 0;
                if (col.IsBoolean) def[col.RawName] = false;
                if (col.IsDateTime) def[col.RawName] = new Date();
                if (col.IsString) def[col.RawName] = '';
                if (col.IsEnum) def[col.RawName] = 0;
                if (col.Configuration.IsNullable) def[col.RawName] = null;
            }
            for (var ck in this._clientValueFunction) {
                def[ck] = this._clientValueFunction[ck](def);
            }
            if (this._hasPrimaryKey) {
                def['__key'] = this.PrimaryKeyFunction(def);
            }
            def['__i'] = this.StoredData.length - 1;
            return def;
        }

        public proceedAdjustments(adjustments: PowerTables.ITableAdjustment): IAdjustmentResult {
            this._masterTable.Events.Adjustment.invokeBefore(this, adjustments);

            if (this.RecentClientQuery == null || this.RecentClientQuery == undefined) return null;
            var needRefilter = false;
            var redrawVisibles = [];
            var touchedData = [];
            var touchedColumns = [];
            var added = [];

            var adjustedObjects = this.deserializeData(adjustments.UpdatedData);

            for (var i = 0; i < adjustedObjects.length; i++) {

                var update = this.getByPrimaryKey(adjustedObjects[i]['__key']);
                if (!update) {
                    //if (this.StoredData.length > 0) { whoai?!
                    this.StoredData.push(adjustedObjects[i]);
                    added.push(adjustedObjects[i]);
                    this._storedDataCache[adjustedObjects[i]['__key']] = adjustedObjects[i];
                    needRefilter = true;
                    //}
                } else {
                    touchedColumns.push(this.copyData(adjustedObjects[i], update));
                    touchedData.push(update);
                    if (update.DisplayedIndex > 0) {
                        redrawVisibles.push(update);
                    }
                    needRefilter = true;
                }
            }

            for (var j = 0; j < adjustments.RemoveKeys.length; j++) {
                var dataObject = this.getByPrimaryKey(adjustments.RemoveKeys[j]);
                if (dataObject == null || dataObject == undefined) continue;

                if (this.StoredData.indexOf(dataObject) > -1) {
                    this.StoredData.splice(this.StoredData.indexOf(dataObject), 1);
                    needRefilter = true;
                    delete this._storedDataCache[adjustments.RemoveKeys[j]];
                }

                if (this.Filtered.indexOf(dataObject) > -1) {
                    this.Filtered.splice(this.Filtered.indexOf(dataObject), 1);
                    needRefilter = true;
                }

                if (this.Ordered.indexOf(dataObject) > -1) {
                    this.Ordered.splice(this.Ordered.indexOf(dataObject), 1);
                    needRefilter = true;
                }
            }
            this._masterTable.Selection.handleAdjustments(added,adjustments.RemoveKeys);

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
        //#endregion

        public Stats:IStats = {
            CurrentPage: 0,
            TotalPages: 0,
            CurrentPageSize: 0,
            TotalItems: 0,
            CurrentlyDisplayingItems: 0,
            TotalLoadedItems: 0
        };

        private updateStats(totalItems?:number) {
            this.Stats.CurrentPage = this.RecentClientQuery.Paging.PageIndex;
            this.Stats.CurrentPageSize = this.RecentClientQuery.Paging.PageSize;
            this.Stats.TotalLoadedItems = this.StoredData.length;
            this.Stats.CurrentlyDisplayingItems = this.DisplayedData.length;
            if (totalItems != null) {
                this.Stats.TotalItems = totalItems;
            }
            if (this.Stats.CurrentPageSize != 0) {
                this.Stats.TotalPages = this.Stats.TotalItems / this.Stats.CurrentPageSize;
            }
        }
    }

    export interface IStats {
        CurrentPage: number;
        TotalPages: number;
        CurrentPageSize: number;
        TotalItems: number;
        CurrentlyDisplayingItems: number;
        TotalLoadedItems:number;
    }

}