/// <reference path="TrackHelper.ts"/>
var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        var RenderingStack = (function () {
            function RenderingStack() {
                this._contextStack = [];
                this.Current = null;
            }
            RenderingStack.prototype.pushContext = function (ctx) {
                this._contextStack.push(ctx);
                this.Current = ctx;
            };
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
                        trk = Rendering.TrackHelper.getPluginTrack(element);
                        break;
                    case RenderingContextType.Header:
                        trk = Rendering.TrackHelper.getHeaderTrack(element);
                        break;
                    case RenderingContextType.Cell:
                        trk = Rendering.TrackHelper.getCellTrack(element);
                        break;
                    case RenderingContextType.Row:
                        trk = Rendering.TrackHelper.getRowTrack(element);
                        break;
                    default:
                        throw new Error("Invalid context element type");
                }
                return trk;
            };
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
        (function (RenderingContextType) {
            RenderingContextType[RenderingContextType["Plugin"] = 0] = "Plugin";
            RenderingContextType[RenderingContextType["Header"] = 1] = "Header";
            RenderingContextType[RenderingContextType["Row"] = 2] = "Row";
            RenderingContextType[RenderingContextType["Cell"] = 3] = "Cell";
        })(Rendering.RenderingContextType || (Rendering.RenderingContextType = {}));
        var RenderingContextType = Rendering.RenderingContextType;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
