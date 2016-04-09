var PowerTables;
(function (PowerTables) {
    var TableEvent = (function () {
        function TableEvent(masterTable) {
            this._handlers = {};
            this._masterTable = masterTable;
        }
        TableEvent.prototype.invoke = function (thisArg, eventArgs) {
            var ea = {
                MasterTable: this._masterTable,
                EventArgs: eventArgs
            };
            var hndlrs = this._handlers;
            var i = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        kHandlers[i].apply(thisArg, ea);
                    }
                    i = 0;
                }
            }
        };
        TableEvent.prototype.subscribe = function (handler, subscriber) {
            if (!this._handlers[subscriber]) {
                this._handlers[subscriber] = [];
            }
            this._handlers[subscriber].push(handler);
        };
        TableEvent.prototype.unsubscribe = function (subscriber) {
            this._handlers[subscriber] = null;
            delete this._handlers[subscriber];
        };
        return TableEvent;
    })();
    PowerTables.TableEvent = TableEvent;
    var EventsManager = (function () {
        function EventsManager(masterTable) {
            this._masterTable = masterTable;
            this.BeforeQueryGathering = new TableEvent(masterTable);
            this.AfterQueryGathering = new TableEvent(masterTable);
            this.BeforeLoading = new TableEvent(masterTable);
            this.LoadingError = new TableEvent(masterTable);
            this.ColumnsCreation = new TableEvent(masterTable);
            this.DataReceived = new TableEvent(masterTable);
            this.AfterLoading = new TableEvent(masterTable);
        }
        EventsManager.prototype.registerEvent = function (eventName) {
            this[eventName] = new TableEvent(this._masterTable);
        };
        return EventsManager;
    })();
    PowerTables.EventsManager = EventsManager;
})(PowerTables || (PowerTables = {}));
