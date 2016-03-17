var PowerTables;
(function (PowerTables) {
    var Event = (function () {
        function Event() {
            this._handlers = {};
        }
        Event.prototype.invoke = function (thisArg, args) {
            var hndlrs = this._handlers;
            var i = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        kHandlers[i].apply(thisArg, args);
                    }
                    i = 0;
                }
            }
        };
        Event.prototype.subscribe = function (handler, key) {
            if (!this._handlers[key]) {
                this._handlers[key] = [];
            }
            this._handlers[key].push(handler);
        };
        Event.prototype.unsubscribe = function (key) {
            this._handlers[key] = null;
            delete this._handlers[key];
        };
        return Event;
    })();
    PowerTables.Event = Event;
    var EventsManager = (function () {
        function EventsManager() {
            this.AfterInit = new Event();
            this.BeforeColumnsRender = new Event();
            this.AfterColumnsRender = new Event();
            this.BeforeFiltersRender = new Event();
            this.BeforeFilterRender = new Event();
            this.AfterFilterRender = new Event();
            this.AfterFiltersRender = new Event();
            this.BeforeColumnHeaderRender = new Event();
            this.AfterColumnHeaderRender = new Event();
            this.BeforeLoading = new Event();
            this.DataReceived = new Event();
            this.AfterLoading = new Event();
            this.BeforeResponseDrawing = new Event();
            this.ResponseDrawing = new Event();
            this.ColumnsOrdering = new Event();
            this.BeforeFilterGathering = new Event();
            this.AfterFilterGathering = new Event();
            this.BeforeRowDraw = new Event();
            this.AfterRowDraw = new Event();
            this.BeforeCellDraw = new Event();
            this.AfterCellDraw = new Event();
            this.BeforeLayoutDraw = new Event();
            this.AfterLayoutDraw = new Event();
            this.SelectionChanged = new Event();
        }
        return EventsManager;
    })();
    PowerTables.EventsManager = EventsManager;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=EventsManager.js.map