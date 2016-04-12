var PowerTables;
(function (PowerTables) {
    /**
     * This entity is responsible for integration of data between storage and rendere.
     * Also it provides functionality for table events subscription and
     * elements location
     */
    var Controller = (function () {
        function Controller(masterTable) {
            this._domEvents = {};
            this._cellDomSubscriptions = {};
            this._rowDomSubscriptions = {};
            this._masterTable = masterTable;
            this._attachFn = document['addEventListener'] || document['attachEvent'];
            this._matches = (function (el) {
                if (!el)
                    return null;
                var p = el.prototype;
                return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
            }(Element));
            this._masterTable.Events.LoadingError.subscribe(this.onLoadingError.bind(this), 'controller');
        }
        Controller.prototype.onLoadingError = function (e) {
            this.showTableMessage({
                Message: e.EventArgs.Reason,
                MessageType: 'error',
                AdditionalData: e.EventArgs.StackTrace,
                IsMessage: true
            });
        };
        /**
         * Initializes full reloading cycle
         * @returns {}
         */
        Controller.prototype.reload = function () {
            var _this = this;
            this._masterTable.Loader.requestServer('query', function () {
                _this.redrawVisibleData();
            });
        };
        /**
         * Redraws row containing currently visible data object
         *
         * @param dataObject Data object
         * @param idx
         * @returns {}
         */
        Controller.prototype.redrawVisibleDataObject = function (dataObject, idx) {
            if (!idx) {
                var dispIndex = this._masterTable.DataHolder.localLookupDisplayedData(dataObject);
                if (dispIndex == null)
                    throw new Error('Cannot redraw object because it is not displaying currently');
                idx = dispIndex.DisplayedIndex;
            }
            var row = this.produceRow(dataObject, idx);
            this._masterTable.Renderer.redrawRow(row);
        };
        /**
         * Redraws locally visible data
         */
        Controller.prototype.redrawVisibleData = function () {
            var rows = this.produceRows();
            this._masterTable.Renderer.body(rows);
        };
        /**
         * Shows full-width table message
         * @param tableMessage Message of type ITableMessage
         * @returns {}
         */
        Controller.prototype.showTableMessage = function (tableMessage) {
            tableMessage.UiColumnsCount = this._masterTable.InstanceManager.getUiColumns().length;
            tableMessage.IsMessage = true;
            this._masterTable.DataHolder.DisplayedData = [tableMessage];
            this.redrawVisibleData();
        };
        /**
         * Subscribe handler to any DOM event happening on particular table cell
         *
         * @param subscription Event subscription
         */
        Controller.prototype.subscribeCellEvent = function (subscription) {
            if (!this._cellDomSubscriptions[subscription.EventId]) {
                this._cellDomSubscriptions[subscription.EventId] = [];
            }
            this._cellDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        };
        /**
         * Subscribe handler to any DOM event happening on particular table row.
         * Note that handler will fire even if particular table cell event happened
         *
         * @param subscription Event subscription
         */
        Controller.prototype.subscribeRowEvent = function (subscription) {
            if (!this._rowDomSubscriptions[subscription.EventId]) {
                this._rowDomSubscriptions[subscription.EventId] = [];
            }
            this._rowDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        };
        //#region event delegation hell
        Controller.prototype.ensureEventSubscription = function (eventId) {
            var fn = this.onTableEvent.bind(this);
            this._attachFn.call(this._masterTable.Renderer.BodyElement, eventId, fn);
            this._domEvents[eventId] = fn;
        };
        Controller.prototype.traverseSubscriptions = function (target, eventType, originalEvent) {
            var t = target;
            var forRow = this._rowDomSubscriptions[eventType];
            var forCell = this._cellDomSubscriptions[eventType];
            var result = [];
            if (!forRow)
                forRow = [];
            if (!forCell)
                forCell = [];
            if (forRow.length === 0 && forCell.length === 0)
                return result;
            var pathToCell = [];
            var pathToRow = [];
            var cellLocation = null, rowIndex = null;
            while (t !== this._masterTable.Renderer.BodyElement) {
                if (this._masterTable.Renderer.Locator.isCell(t)) {
                    cellLocation = PowerTables.TrackHelper.getCellLocation(t);
                }
                if (this._masterTable.Renderer.Locator.isRow(t)) {
                    rowIndex = PowerTables.TrackHelper.getRowIndex(t);
                }
                if (cellLocation == null)
                    pathToCell.push(t);
                if (rowIndex == null)
                    pathToRow.push(t);
                t = t.parentElement;
            }
            if (cellLocation != null) {
                var cellArgs = {
                    Table: this._masterTable,
                    OriginalEvent: originalEvent,
                    DisplayingRowIndex: cellLocation.RowIndex,
                    ColumnIndex: cellLocation.ColumnIndex
                };
                this.traverseAndFire(forCell, pathToCell, cellArgs);
            }
            if (rowIndex != null) {
                var rowArgs = {
                    Table: this._masterTable,
                    OriginalEvent: originalEvent,
                    DisplayingRowIndex: rowIndex
                };
                this.traverseAndFire(forRow, pathToRow, rowArgs);
            }
        };
        Controller.prototype.traverseAndFire = function (subscriptions, path, args) {
            for (var i = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].Selector) {
                    for (var j = 0; j < path.length; j++) {
                        if (this._matches.call(path[j], subscriptions[i].Selector)) {
                            subscriptions[i].Handler(args);
                            break;
                        }
                    }
                }
                else {
                    subscriptions[i].Handler(args);
                }
            }
        };
        Controller.prototype.onTableEvent = function (e) {
            this.traverseSubscriptions((e.target || e.srcElement), e.type, e);
        };
        //#endregion
        /**
         * Inserts data entry to local storage
         *
         * @param insertion Insertion command
         */
        Controller.prototype.insertLocalRow = function (insertion) {
            if (insertion.RedrawBehavior === RedrawBehavior.ReloadFromServer) {
                this.reload();
            }
            else {
                this._masterTable.DataHolder.StoredData.splice(insertion.StorageRowIndex, 0, insertion.DataObject);
                if (insertion.RedrawBehavior === RedrawBehavior.LocalFullRefresh)
                    this.localFullRefresh();
                else {
                    this._masterTable.DataHolder.DisplayedData.splice(insertion.DisplayRowIndex, 0, insertion.DataObject);
                    if (insertion.RedrawBehavior === RedrawBehavior.RedrawVisible)
                        this.redrawVisibleData();
                    else if (insertion.RedrawBehavior === RedrawBehavior.LocalVisibleReorder)
                        this.localVisibleReorder();
                    else if (insertion.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        var row = this.produceRow(insertion.DataObject, insertion.DisplayRowIndex);
                        this._masterTable.Renderer.appendRow(row, insertion.DisplayRowIndex);
                    }
                }
            }
        };
        /**
         * Removes data entry from local storage
         *
         * @param insertion Insertion command
         */
        Controller.prototype.deleteLocalRow = function (deletion) {
            if (deletion.RedrawBehavior === RedrawBehavior.ReloadFromServer) {
                this.reload();
            }
            else {
                this._masterTable.DataHolder.StoredData.splice(deletion.StorageRowIndex, 1);
                if (deletion.RedrawBehavior === RedrawBehavior.LocalFullRefresh)
                    this.localFullRefresh();
                else {
                    this._masterTable.DataHolder.DisplayedData.splice(deletion.DisplayRowIndex, 1);
                    if (deletion.RedrawBehavior === RedrawBehavior.RedrawVisible)
                        this.redrawVisibleData();
                    else if (deletion.RedrawBehavior === RedrawBehavior.LocalVisibleReorder)
                        this.localVisibleReorder();
                    else if (deletion.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        this._masterTable.Renderer.removeRowByIndex(deletion.DisplayRowIndex);
                    }
                }
            }
        };
        /**
         * Updates data entry in local storage
         *
         * @param insertion Insertion command
         */
        Controller.prototype.updateLocalRow = function (update) {
            if (update.RedrawBehavior === RedrawBehavior.ReloadFromServer) {
                this.reload();
            }
            else {
                var object = this._masterTable.DataHolder.localLookupStoredData(update.StorageRowIndex);
                update.UpdateFn(object);
                if (update.RedrawBehavior === RedrawBehavior.LocalFullRefresh)
                    this.localFullRefresh();
                else {
                    // not required to update displayed object because we are updating reference
                    if (update.RedrawBehavior === RedrawBehavior.RedrawVisible)
                        this.redrawVisibleData();
                    else if (update.RedrawBehavior === RedrawBehavior.LocalVisibleReorder)
                        this.localVisibleReorder();
                    else if (update.RedrawBehavior === RedrawBehavior.ParticularRowUpdate) {
                        var row = this.produceRow(object, update.DisplayRowIndex);
                        this._masterTable.Renderer.redrawRow(row);
                    }
                }
            }
        };
        Controller.prototype.localFullRefresh = function () {
            this._masterTable.DataHolder.filterStoredDataWithPreviousQuery();
            this.redrawVisibleData();
        };
        Controller.prototype.localVisibleReorder = function () {
            this._masterTable.DataHolder.DisplayedData = this._masterTable.DataHolder.orderSet(this._masterTable.DataHolder.DisplayedData, this._masterTable.DataHolder.RecentClientQuery);
            this.redrawVisibleData();
        };
        /**
         * Converts data object to display row
         *
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param columns Optional displaying columns set
         * @returns {IRow} Row representing displayed object
         */
        Controller.prototype.produceRow = function (dataObject, idx, columns) {
            if (!dataObject)
                return null;
            if (!columns)
                columns = this._masterTable.InstanceManager.getUiColumns();
            var rw = {
                DataObject: dataObject,
                Index: idx,
                MasterTable: this._masterTable
            };
            if (dataObject.IsMessage) {
                rw.renderElement = function (hb) { return hb.getCachedTemplate('messages')(dataObject); };
                rw.IsSpecial = true;
                return rw;
            }
            var cells = {};
            for (var j = 0; j < columns.length; j++) {
                var col = columns[j];
                var cell = {
                    Column: col,
                    Data: dataObject[col.RawName],
                    DataObject: dataObject,
                    Row: rw,
                    renderContent: null,
                    renderElement: null
                };
                cells[col.RawName] = cell;
            }
            rw.Cells = cells;
            return rw;
        };
        Controller.prototype.produceRows = function () {
            this._masterTable.Events.BeforeDataRendered.invoke(this, null);
            var result = [];
            var columns = this._masterTable.InstanceManager.getUiColumns();
            for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                var row = this.produceRow(this._masterTable.DataHolder.DisplayedData[i], i, columns);
                if (!row)
                    continue;
                result.push(row);
            }
            return result;
        };
        return Controller;
    })();
    PowerTables.Controller = Controller;
    /**
     * Behavior of redrawing table after modification
     */
    (function (RedrawBehavior) {
        /**
         * To perform UI redraw, data will be entirely reloaded from server.
         * Local data will not be affected due to further reloading
         */
        RedrawBehavior[RedrawBehavior["ReloadFromServer"] = 0] = "ReloadFromServer";
        /**
         * Filters will be reapplied only locally.
         * Currently displaying data will be entirely redrawn with client filters
         * using locally cached data from server.
         *
         * In this case, if modified rows are not satisfying any server conditions then
         * is will still stay in table. That may seem illogical for target users.
         */
        RedrawBehavior[RedrawBehavior["LocalFullRefresh"] = 1] = "LocalFullRefresh";
        /**
         * Filters will be reapplied locally but only on currently displaying data.
         *
         * In this case, deleted row will simply disappear, added row will be added to currently
         * displaying cells set and currently displaying set will be re-ordered, modified
         * row will be ordered among only displaying set without filtering.
         * This approach is quite fast and may be useful in various cases
         */
        RedrawBehavior[RedrawBehavior["LocalVisibleReorder"] = 2] = "LocalVisibleReorder";
        /**
         * Simply redraw all the visible cells without additional filtering.
         *
         * May lead to glitches e.g. invalid elements count on page or invalid
         * items order. Most suitable for updating that does not touch filtering/ordering-sensetive
         * data.
         */
        RedrawBehavior[RedrawBehavior["RedrawVisible"] = 3] = "RedrawVisible";
        /**
         * Only particular row mentioned in modification request will be updated.
         * No server reloading, no reordering, no re-sorting. Row will stay in place or
         * will be added at specified position or will be simply disappear from currently displayed set.
         * In some cases such behavior may confuse users, but still stay suitable for most cases.
         * Of course, it will disappear after on next filtering if no more satisfying
         * filter conditions.
         */
        RedrawBehavior[RedrawBehavior["ParticularRowUpdate"] = 4] = "ParticularRowUpdate";
        /**
         * Modification request will not affect UI anyhow until next filtering. Confusing.
         */
        RedrawBehavior[RedrawBehavior["DoNothing"] = 5] = "DoNothing";
    })(PowerTables.RedrawBehavior || (PowerTables.RedrawBehavior = {}));
    var RedrawBehavior = PowerTables.RedrawBehavior;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Controller.js.map