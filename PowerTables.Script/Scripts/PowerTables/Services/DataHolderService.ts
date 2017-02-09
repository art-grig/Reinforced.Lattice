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
            this._configuration = masterTable.Configuration;
            this.compileComparisonFunction();
        }

        private _configuration: PowerTables.ITableConfiguration;

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
         * Data that actually is currently displayed in table.
         * If target user uses partition correctly - usually it is small collection.
         * And let's keep it small
         */
        public DisplayedData: any[] = [];

        /**
         * Data that was recently loaded from server
         */
        public StoredData: any[] = [];

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

        public compileKeyFunction(keyFields: string[]): (x: any) => string {
            if (!window['___ltcstrh']) {
                window['___ltcstrh'] = function (x: String) {
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
            for (var i = 0; i < keyFields.length; i++) {
                var field = keyFields[i];
                if (this._instances.Columns[keyFields[i]].IsDateTime) {
                    fields.push(`((x.${field})==null?'':((x.${field}).getTime()))`);
                } else {
                    if (this._instances.Columns[keyFields[i]].IsBoolean) {
                        fields.push(`((x.${field})==null?'':(x.${field}?'1':'0'))`);
                    }
                    else if (this._instances.Columns[keyFields[i]].IsString) {

                        fields.push(`(window.___ltcstrh(x.${field}))`);
                    } else {
                        fields.push(`((x.${field})==null?'':(x.${field}.toString()))`);
                    }
                }
            }
            var keyStr = fields.join('+":"+');
            return eval(`(function(x) { return (${keyStr}) + ':'; })`);

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
            this.DataObjectComparisonFunction = function (x, y) { return x['__key'] === y['__key']; };
            this.PrimaryKeyFunction = this.compileKeyFunction(this._configuration.KeyFields);
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
            return this._anyClientFiltration;
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
                        if (this._pkDataCache.hasOwnProperty(obj['__key'])) {
                            obj['__i'] = this._pkDataCache[obj['__key']]['__i'];
                        }
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

        public StoredCache: { [_: number]: any } = {}
        public storeResponse(response: IPowerTablesResponse, clientQuery: IQuery) {
            var data: any[] = [];
            var obj: {} = {};
            var currentColIndex: number = this.getNextNonSpecialColumn(-1);
            var currentCol: string = this._rawColumnNames[currentColIndex];
            if (!clientQuery.IsBackgroundDataFetch) {
                this._pkDataCache = {};
                this.StoredCache = {};
            }

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

                    if (this._hasPrimaryKey) {
                        obj['__key'] = this.PrimaryKeyFunction(obj);
                        if (!this._pkDataCache[obj['__key']]) data.push(obj);
                        this._pkDataCache[obj['__key']] = obj; // line that makes difference
                    } else {
                        data.push(obj);
                    }
                    obj['__i'] = clientQuery.Partition.Skip + data.length - 1;
                    this.StoredCache[obj['__i']] = obj;
                    obj = {};
                }
                currentCol = this._rawColumnNames[currentColIndex];
            }
            if (!clientQuery.IsBackgroundDataFetch) this.StoredData = data;
            else this.StoredData = this.StoredData.concat(data);


        }

        private _pkDataCache: { [_: string]: any };

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

        public satisfyCurrentFilters(obj: any): boolean {
            return this.satisfyFilters(obj, this.RecentClientQuery);
        }

        public satisfyFilters(obj: any, query: IQuery): boolean {
            if (this._filters.length === 0) return true;
            var acceptable: boolean = true;
            for (var j: number = 0; j < this._filters.length; j++) {
                var filter: IClientFilter = this._filters[j];
                acceptable = filter.filterPredicate(obj, query);
                if (!acceptable) break;
            }
            return acceptable;
        }

        public orderWithCurrentOrderings(set: any[]) {
            return this.orderSet(set, this.RecentClientQuery);
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

        public filterStoredData(query: IQuery, serverCount: number) {
            this._events.ClientDataProcessing.invokeBefore(this, query);

            this.DisplayedData = this.StoredData;
            this.Filtered = this.StoredData;
            this.Ordered = this.StoredData;

            this.RecentClientQuery = query;

            if (this.isClientFiltrationPending() && (!(!query))) {
                var copy: any[] = this.StoredData.slice();

                this._masterTable.Events.Filtered.invokeBefore(this, copy);
                this.Filtered = this.filterSet(copy, query);
                this._masterTable.Events.Filtered.invokeAfter(this, this.Filtered);

                this._masterTable.Events.Ordered.invokeBefore(this, this.Filtered);
                this.Ordered = this.orderSet(this.Filtered, query);
                this._masterTable.Events.Ordered.invokeAfter(this, this.Ordered);

            }
            this.DisplayedData = this._masterTable.Partition.partitionAfterQuery(this.Ordered, query, serverCount);

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
            this.filterStoredData(this.RecentClientQuery, -1);
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
            return this._pkDataCache[this.PrimaryKeyFunction(primaryKeyPart)];
        }

        public getByPrimaryKey(primaryKey: string): any {
            return this._pkDataCache[primaryKey];
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
            if (!this._pkDataCache.hasOwnProperty(pk)) return nullResult;

            found = this._pkDataCache[pk];
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

            var objects = this.deserializeData(adjustments.UpdatedData);

            for (var i = 0; i < objects.length; i++) {

                var update = this.getByPrimaryKey(objects[i]['__key']);
                if (!update) {
                    //if (this.StoredData.length > 0) { whoai?!
                    this.StoredData.push(objects[i]);
                    if (!objects[i].hasOwnProperty('__i')) {
                        objects[i]['__i'] = this._masterTable.Partition.Skip + this.StoredData.length - 1;
                    }
                    added.push(objects[i]);
                    this._pkDataCache[objects[i]['__key']] = objects[i];
                    this.StoredCache[objects[i]['__i']] = objects[i];
                    needRefilter = true;
                    //}
                } else {
                    touchedColumns.push(this.copyData(objects[i], update));
                    touchedData.push(update);
                    if (this.DisplayedData.indexOf(update) > -1) {
                        redrawVisibles.push(update);
                    }
                    needRefilter = true;
                }
            }

            for (var j = 0; j < adjustments.RemoveKeys.length; j++) {
                var dataObject = this.getByPrimaryKey(adjustments.RemoveKeys[j]);
                if (dataObject == null || dataObject == undefined) continue;

                var storedIdx = this.StoredData.indexOf(dataObject);
                if (storedIdx > -1) {
                    var dto = this.StoredData[storedIdx];
                    this.StoredData.splice(this.StoredData.indexOf(dataObject), 1);
                    needRefilter = true;
                    delete this._pkDataCache[adjustments.RemoveKeys[j]];
                    delete this.StoredCache[dto['__i']];
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
            this._masterTable.Selection.handleAdjustments(added, adjustments.RemoveKeys);

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
    }



}