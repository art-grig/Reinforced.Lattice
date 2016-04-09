var PowerTables;
(function (PowerTables) {
    var DataHolder = (function () {
        function DataHolder(rawColumnNames, isColumnDateTimeFunc, events) {
            this._comparators = {};
            this._filters = [];
            this._anyClientFiltration = false;
            this.Selector = null;
            this._rawColumnNames = rawColumnNames;
            this._isColumnDateTimeFunc = isColumnDateTimeFunc;
            this._events = events;
        }
        DataHolder.prototype.registerClientFilter = function (filter) {
            this._anyClientFiltration = true;
            this._filters.push(filter);
        };
        DataHolder.prototype.registerClientOrdering = function (dataField, comparator) {
            this._anyClientFiltration = true;
            this._comparators[dataField] = comparator;
        };
        DataHolder.prototype.isClientFiltrationPending = function () {
            return ((!(!this.Selector)) || this._anyClientFiltration);
        };
        DataHolder.prototype.storeResponse = function (response, clientQuery) {
            var data = [];
            var obj = {};
            var currentColIndex = 0;
            var currentCol = this._rawColumnNames[currentColIndex];
            for (var i = 0; i < response.Data.length; i++) {
                if (this._isColumnDateTimeFunc(currentCol)) {
                    if (response.Data[i]) {
                        obj[currentCol] = Date.parse(response.Data[i]);
                    }
                    else {
                        obj[currentCol] = null;
                    }
                }
                else {
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
        };
        DataHolder.prototype.filterRecentData = function (query) {
            if (this.isClientFiltrationPending() && (!(!query))) {
                if (this._filters.length === 0) {
                    this.CurrentlyDisplaying = this.LastLoaded;
                }
                else {
                    var result = [];
                    for (var i = 0; i < this.LastLoaded.length; i++) {
                        var obj = this.LastLoaded[i];
                        var acceptable = true;
                        for (var j = 0; j < this._filters.length; j++) {
                            var filter = this._filters[j];
                            acceptable = filter.filterPredicate(obj, query);
                            if (!acceptable)
                                break;
                        }
                        if (!acceptable)
                            continue;
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
                            if (orderingDirection === PowerTables.Ordering.Neutral)
                                continue;
                            if (!this._comparators[orderingKey])
                                continue;
                            var negate = orderingDirection === PowerTables.Ordering.Descending;
                            sortFn += "cc = f" + orderFns.length + "(a,b); ";
                            comparersArg += "f" + orderFns.length + ",";
                            orderFns.push(this._comparators[orderingKey]);
                            sortFn += "if (cc!=0) return " + (negate ? '-cc' : 'cc') + "; ";
                        }
                    }
                    comparersArg = comparersArg.substr(0, comparersArg.length - 1);
                    sortFn = "function(" + comparersArg + "){ return function (a,b) { var cc = 0; " + sortFn + " return 0; } }";
                    var sortFunction = eval(sortFn).apply(null, orderFns);
                    var ordered = this.CurrentlyDisplaying.sort(sortFunction);
                    this.CurrentlyDisplaying = ordered;
                }
                if (this.Selector) {
                    this.CurrentlyDisplaying = this.Selector.selectData(this.CurrentlyDisplaying, query);
                }
            }
        };
        return DataHolder;
    })();
    PowerTables.DataHolder = DataHolder;
})(PowerTables || (PowerTables = {}));
