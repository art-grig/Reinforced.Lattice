module PowerTables.Templating {
    export class TemplateProcess {
        constructor(uiColumns: () => IColumn[]) {
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
            this.UiColumns = uiColumns();
        }

        private _stack: PowerTables.Templating.RenderingStack;
        public Html: string = '';
        public w: IWriteFn;
        public Model: any;
        public Type: RenderedObject;
        public BackInfo: PowerTables.Templating.IBackbindInfo;
        public Executor: TemplatesExecutor;
        public UiColumns: IColumn[];

        public ColumnRenderes: { [key: string]: (x: ICell) => string };

        private append(str: string): void {
            if (!str) return;
            this.Html += str;
        }

        public nest(data: any, templateId: string) {
            this.Executor.nest(data, templateId, this);
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
            this.Model = this.Model;
            this.Type = this._stack.Current.Type;
        }

        public u() {
            this._stack.popContext();
            this.Model = this.Model;
            this.Type = this._stack.Current.Type;
        }

        public vstate(stateName: string, state: PowerTables.Templating.IState): void {
            state.Receiver = this.Model;
            if (!this.BackInfo.CachedVisualStates[stateName]) this.BackInfo.CachedVisualStates[stateName] = [];
            var index = this.BackInfo.CachedVisualStates[stateName].length;
            this.BackInfo.CachedVisualStates[stateName].push(state);
            this.BackInfo.HasVisualStates = true;
            this.w(`data-state-${stateName}="${index}"`);
        }

        public evt(): void {
            var commaSeparatedFunctions = arguments[0];
            var commaSeparatedEvents = arguments[1];
            var eventArgs: any[] = [];
            if (arguments.length > 3) {
                for (var i: number = 2; i <= arguments.length - 2; i++) {
                    eventArgs.push(arguments[i]);
                }
            }
            var ed: IEventDescriptor = <IEventDescriptor>{
                EventReceiver: this.Model,
                Functions: commaSeparatedFunctions.split(','),
                Events: commaSeparatedEvents.split(','),
                EventArguments: eventArgs
            };
            var index: number = this.BackInfo.EventsQueue.length;
            this.BackInfo.EventsQueue.push(ed);
            this.w(`data-be-${index}="${index}" data-evb="true"`);
        }

        public rc() {
            var fn = arguments[0];
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var index: number = this.BackInfo.CallbacksQueue.length;
            this.BackInfo.CallbacksQueue.push({
                Callback: fn,
                CallbackArguments: args,
                Target: window
            });
            this.w(`data-cb="${index}"`);
        }

        public dc() {
            var fn = arguments[0];
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var index: number = this.BackInfo.DestroyCallbacksQueue.length;
            this.BackInfo.DestroyCallbacksQueue.push({
                Callback: fn,
                CallbackArguments: args,
                Target: window
            });
            this.w(`data-dcb="${index}"`);
        }

        public mark(fieldName: string, key: string, receiverPath: string) {
            var index: number = this.BackInfo.MarkQueue.length;
            var receiver = this.Model;
            if (receiverPath != null) {
                var tp = PowerTables.Rendering.BackBinder.traverseWindowPath(receiverPath);
                receiver = tp.target || tp.parent;
            }
            var md: IMarkDescriptor = <IMarkDescriptor>{
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
                var md: IDatepickerDescriptor = <IDatepickerDescriptor>{
                    ElementReceiver: this._stack.Current.Object,
                    IsNullable: nullable
                };
                this.BackInfo.DatepickersQueue.push(md);
                this.w(`data-dp="${index}"`);
            }
        }

        public track(): void {
            var trk: string = this._stack.Current.CurrentTrack;
            if (trk.length === 0) return;
            this.w(`data-track="${trk}"`);
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
         * Custom rendering object. 
         * Needed for rendering of random templates bound to random objects
         */
        Custom

    }
}