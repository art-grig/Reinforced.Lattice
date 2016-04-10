var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        /**
         * Rendering stack class. Provives common helper
         * infrastructure for context-oriented rendering
         */
        var RenderingStack = (function () {
            function RenderingStack() {
                this._contextStack = [];
                /**
                 * Current rendering context
                 */
                this.Current = null;
            }
            /**
             * Clears rendering stack
             * @returns {}
             */
            RenderingStack.prototype.clear = function () {
                this.Current = null;
                if (this._contextStack.length === 0)
                    return;
                this._contextStack = [];
            };
            /**
             * Pushes rendering context into stack
             * @param ctx
             * @returns {}
             */
            RenderingStack.prototype.pushContext = function (ctx) {
                this._contextStack.push(ctx);
                this.Current = ctx;
            };
            /**
             * Pushes rendering context into stack
             * @param elementType What is being rendered
             * @param element Reference to object is being rendered
             * @param columnName Optional column name - for column-contexted rendering objects
             * @returns {}
             */
            RenderingStack.prototype.push = function (elementType, element, columnName) {
                if (columnName === void 0) { columnName = ''; }
                var ctx = {
                    Type: elementType,
                    Object: element,
                    ColumnName: columnName,
                    CurrentTrack: this.getTrack(elementType, element)
                };
                this._contextStack.push(ctx);
                this.Current = ctx;
            };
            RenderingStack.prototype.getTrack = function (elementType, element) {
                var trk;
                switch (elementType) {
                    case RenderingContextType.Plugin:
                        trk = PowerTables.TrackHelper.getPluginTrack(element);
                        break;
                    case RenderingContextType.Header:
                        trk = PowerTables.TrackHelper.getHeaderTrack(element);
                        break;
                    case RenderingContextType.Cell:
                        trk = PowerTables.TrackHelper.getCellTrack(element);
                        break;
                    case RenderingContextType.Row:
                        trk = PowerTables.TrackHelper.getRowTrack(element);
                        break;
                    default:
                        throw new Error("Invalid context element type");
                }
                return trk;
            };
            /**
             * Pops rendering context from stack
             * @returns {}
             */
            RenderingStack.prototype.popContext = function () {
                this._contextStack.pop();
                if (this._contextStack.length === 0)
                    this.Current = null;
                else
                    this.Current = this._contextStack[this._contextStack.length - 1];
            };
            return RenderingStack;
        })();
        Rendering.RenderingStack = RenderingStack;
        /**
         * What renders in current helper method
         */
        (function (RenderingContextType) {
            /**
             * Plugin (0)
             */
            RenderingContextType[RenderingContextType["Plugin"] = 0] = "Plugin";
            /**
             * Column header (1)
             */
            RenderingContextType[RenderingContextType["Header"] = 1] = "Header";
            /**
             * Row (containing cells) (2)
             */
            RenderingContextType[RenderingContextType["Row"] = 2] = "Row";
            /**
             * Cell (belonging to row and column) (3)
             */
            RenderingContextType[RenderingContextType["Cell"] = 3] = "Cell";
        })(Rendering.RenderingContextType || (Rendering.RenderingContextType = {}));
        var RenderingContextType = Rendering.RenderingContextType;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=RenderingStack.js.map