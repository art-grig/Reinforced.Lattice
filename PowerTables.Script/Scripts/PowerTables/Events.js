var PowerTables;
(function (PowerTables) {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    var TableEvent = (function () {
        function TableEvent(masterTable) {
            this._handlers = {};
            this._masterTable = masterTable;
        }
        /**
         * Invokes event with overridden this arg and specified event args
         *
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
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
        /**
         * Subscribes specified function to event with supplied string key.
         * Subscriber key is needed to have an ability to unsubscribe from event
         * and should reflect entity that has been subscriben
         *
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        TableEvent.prototype.subscribe = function (handler, subscriber) {
            if (!this._handlers[subscriber]) {
                this._handlers[subscriber] = [];
            }
            this._handlers[subscriber].push(handler);
        };
        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        TableEvent.prototype.unsubscribe = function (subscriber) {
            this._handlers[subscriber] = null;
            delete this._handlers[subscriber];
        };
        return TableEvent;
    })();
    PowerTables.TableEvent = TableEvent;
    /**
     * Events manager for table.
     * Contains all available events
     */
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
            this.BeforeLayoutDrawn = new TableEvent(masterTable);
            this.AfterLayoutDrawn = new TableEvent(masterTable);
        }
        /**
         * Registers new event for events manager.
         * This method is to be used by plugins to provide their
         * own events.
         *
         * Events being added should be described in plugin's .d.ts file
         * as extensions to Events manager
         * @param eventName Event name
         * @returns {}
         */
        EventsManager.prototype.registerEvent = function (eventName) {
            this[eventName] = new TableEvent(this._masterTable);
        };
        return EventsManager;
    })();
    PowerTables.EventsManager = EventsManager;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Events.js.map