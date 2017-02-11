module PowerTables.Templating {
    export class TemplateProcess {
        constructor(uiColumns: () => IColumn[], executor: PowerTables.Templating.TemplatesExecutor) {
            this._stack = new PowerTables.Templating.RenderingStack();
            this.BackInfo = {
                CachedVisualStates: {},
                CallbacksQueue: [],
                DatepickersQueue: [],
                DestroyCallbacksQueue: [],
                EventsQueue: [],
                HasVisualStates: false,
                MarkQueue: []
            };
            this.w = this.append.bind(this);
            this.s = this.spaceW.bind(this);
            this.UiColumns = uiColumns();
            this.Executor = executor;
        }

        private _stack: PowerTables.Templating.RenderingStack;
        public Html: string = '';
        public w: IWriteFn;
        public s: IWriteFn;
        public Context: IRenderingContext;
        public BackInfo: PowerTables.Templating.IBackbindInfo;
        public Executor: TemplatesExecutor;
        public UiColumns: IColumn[];

        public ColumnRenderes: { [key: string]: (x: ICell) => string };

        private append(str: any): void {
            if (str == null || str == undefined) return;
            if (this.Context.CurrentTrack != null && !this.Context.IsTrackWritten) {
                var strPiece = str.toString();
                this.autotrack(strPiece);
            } else this.Html += str.toString();
        }

        private autotrack(str: string) {
            this.Context.TrackBuffer += str;
            var idx = this.findStartTag(this.Context.TrackBuffer);
            if (idx < 0) return;
            if (idx === this.Context.TrackBuffer.length) {
                this.Context.TrackBuffer += this.trackAttr();
            } else {
                var head = this.Context.TrackBuffer.substr(0, idx);
                var tail = this.Context.TrackBuffer.substring(idx, this.Context.TrackBuffer.length);
                this.Context.TrackBuffer = head + this.trackAttr() + tail;
            }
            this.Html += this.Context.TrackBuffer;
            this.Context.IsTrackWritten = true;
        }

        private static alphaRegex = /[a-zA-Z]/;

        private findStartTag(buf: string): number {
            var idx = buf.indexOf('<');
            if (idx < 0) return -1;

            while ((idx + 1 < buf.length - 1) && (!TemplateProcess.alphaRegex.test(buf.charAt(idx + 1)))) {
                idx = buf.indexOf('<', idx + 1);
            }
            if (idx < 0) return -1;

            idx++;
            while ((idx < buf.length) && TemplateProcess.alphaRegex.test(buf.charAt(idx))) idx++;
            return idx;

        }

        public nest(data: any, templateId: string) {
            this.Executor.nest(data, templateId, this);
        }

        private spc(num: number): string {
            if (this.Executor.Spaces[num])
                return this.Executor.Spaces[num];
            var r = '';
            for (var i = 0; i < num; i++) {
                r += ' ';
            }
            this.Executor[num] = r;
            return r;
        }

        public spaceW() {
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === "number") {
                    this.w(this.spc(<number>arguments[i]));
                } else {
                    this.w(arguments[i]);
                }
            }
        }

        public nestElement(e: IRenderable, templateId: string, type: RenderedObject) {
            if (e.renderElement) {
                this.d(e, type);
                e.renderElement(this);
                this.u();
            } else {
                if (!templateId)
                    throw new
                        Error('Renderable object must have either .renderElement implemented or templateId specified');
                this.nest(e, templateId);
            }
        }

        public nestContent(e: IRenderable, templateId: string) {
            if (e.renderContent) {
                e.renderContent(this);
            } else {
                if (!templateId)
                    throw new
                        Error('Renderable object must have either .renderContent implemented or templateId specified');
                this.nest(e, templateId);
            }
        }

        public d(model: any, type: RenderedObject) {
            this._stack.push(type, model);
            this.Context = this._stack.Current;
        }

        public u() {
            this._stack.popContext();
            if (!this._stack.Current) {
                this.Context = null;
            } else {
                this.Context = this._stack.Current;
            }
        }

        public vs(stateName: string, state: PowerTables.Templating.IState): void {
            state.Receiver = this.Context.Object;
            if (!this.BackInfo.CachedVisualStates[stateName]) this.BackInfo.CachedVisualStates[stateName] = [];
            var index = this.BackInfo.CachedVisualStates[stateName].length;
            this.BackInfo.CachedVisualStates[stateName].push(state);
            this.BackInfo.HasVisualStates = true;
            this.w(`data-state-${stateName}="${index}"`);
        }

        public e(commaSeparatedFunctions: string, commaSeparatedEvents: string, eventArgs: any[]): void {
            var ed: PowerTables.Templating.IBackbindEvent = <PowerTables.Templating.IBackbindEvent>{
                EventReceiver: this.Context.Object,
                Functions: commaSeparatedFunctions.split(','),
                Events: commaSeparatedEvents.split(','),
                EventArguments: eventArgs
            };
            var index: number = this.BackInfo.EventsQueue.length;
            this.BackInfo.EventsQueue.push(ed);
            this.w(`data-be-${index}="${index}" data-evb="true"`);
        }

        public rc(fn: any, args: any[]) {
            var index: number = this.BackInfo.CallbacksQueue.length;
            this.BackInfo.CallbacksQueue.push({
                Callback: fn,
                CallbackArguments: args,
                Target: window
            });
            this.w(`data-cb="${index}"`);
        }

        public dc(fn: any, args: any[]) {
            var index: number = this.BackInfo.DestroyCallbacksQueue.length;
            this.BackInfo.DestroyCallbacksQueue.push({
                Callback: fn,
                CallbackArguments: args,
                Target: window
            });
            this.w(`data-dcb="${index}"`);
        }

        public m(fieldName: string, key: string, receiverPath: string) {
            var index: number = this.BackInfo.MarkQueue.length;
            var receiver = this.Context.Object;
            if (receiverPath != null) {
                var tp = PowerTables.Rendering.BackBinder.traverseWindowPath(receiverPath);
                receiver = tp.target || tp.parent;
            }
            var md: PowerTables.Templating.IBackbindMark = <PowerTables.Templating.IBackbindMark>{
                ElementReceiver: receiver,
                FieldName: fieldName,
                Key: key
            };
            this.BackInfo.MarkQueue.push(md);
            this.w(`data-mrk="${index}"`);
        }

        public dp(condition: boolean, nullable: boolean) {
            var index: number = this.BackInfo.DatepickersQueue.length;

            if (condition) {
                var md: PowerTables.Templating.IBackbindDatepicker = <PowerTables.Templating.IBackbindDatepicker>{
                    ElementReceiver: this.Context.Object,
                    IsNullable: nullable
                };
                this.BackInfo.DatepickersQueue.push(md);
                this.w(`data-dp="${index}"`);
            }
        }

        private trackAttr(): string {
            var trk: string = this._stack.Current.CurrentTrack;
            if (trk.length === 0) return null;
            var tra = `data-track="${trk}"`;
            if (this.Context.Type === RenderedObject.Row || this.Context.Type === RenderedObject.Partition) {
                if ((<IRow>this.Context.Object).IsSpecial) {
                    tra += ` data-spr='true'`;
                }
            }
            return ' ' + tra + ' ';
        }

        public isLocation(location: string): boolean {
            if (this.Context.Type === RenderedObject.Plugin) {
                var loc: string = this.Context.Object['PluginLocation'];
                if (loc.length < location.length) return false;
                if (loc.length === location.length && loc === location) return true;
                if (loc.substring(0, location.length) === location) return true;
            }
            return false;
        }
    }



    /**
     * What renders in current helper method
     */
    export enum RenderedObject {
        /**
         * Plugin (0)
         */
        Plugin,
        /**
         * Column header (1)
         */
        Header,
        /**
         * Row (containing cells) (2)
         */
        Row,
        /**
         * Cell (belonging to row and column) (3)
         */
        Cell,
        /**
         * Template region for messages
         */
        Message,
        /**
         * Template region for partition tools row
         */
        Partition,
        /**
         * Custom rendering object. 
         * Needed for rendering of random templates bound to random objects
         */
        Custom

    }
}