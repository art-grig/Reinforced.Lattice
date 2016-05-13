module PowerTables.Rendering {
    export class BackBinder {
        private _eventsQueue: IEventDescriptor[] = [];
        private _markQueue: IMarkDescriptor[] = [];
        private _datepickersQueue: IDatepickerDescriptor[] = [];
        private _callbacksQueue: ICallbackDescriptor[] = [];
        private _destroyCallbacksQueue: ICallbackDescriptor[] = [];

        private _instances: InstanceManager;
        private _stack: RenderingStack;
        private _dateService: DateService;
        private _stealer: any;
        private _cachedVisualStates: { [key: string]: IState[] } = {};
        private _hasVisualStates: boolean = false;

        public Delegator: EventsDelegator;

        constructor(hb: Handlebars.IHandlebars, instances: InstanceManager, stack: RenderingStack, dateService: DateService) {
            this._instances = instances;
            hb.registerHelper('BindEvent', this.bindEventHelper.bind(this));
            hb.registerHelper('Mark', this.markHelper.bind(this));
            hb.registerHelper('Datepicker', this.datepickerHelper.bind(this));
            hb.registerHelper('VState', this.visualStateHelper.bind(this));
            hb.registerHelper('RenderCallback', this.renderCallbackHelper.bind(this));
            hb.registerHelper('DestroyCallback', this.destroyCallbackHelper.bind(this));

            this._stack = stack;
            this._dateService = dateService;
        }

        private traverseBackbind<T>(elements: HTMLElement[], parentElement: HTMLElement, backbindCollection: T[], attribute: string, fn: (backbind: T, element: HTMLElement) => void) {
            for (var i: number = 0; i < elements.length; i++) {
                var element: HTMLElement = elements[i];
                var attr = null;
                for (var j = 0; j < element.attributes.length; j++) {
                    if (element.attributes.item(j).name.substring(0, attribute.length) === attribute) {
                        attr = element.attributes.item(j);
                        var idx: number = parseInt(attr.value);
                        var backbindDescription: T = backbindCollection[idx];
                        fn.call(this, backbindDescription, element);
                        element.removeAttribute(attr.name);
                    }
                }
            }
        }

        private getMatchingElements(parent: HTMLElement, attr: string): any {
            var list = parent.querySelectorAll(`[${attr}]`);
            var result = [];
            for (var i: number = 0; i < list.length; i++) {
                result.push(list.item(i));
            }
            if (parent.hasAttribute(attr)) result.push(parent);
            return result;
        }
        /**
         * Applies binding of events left in events queue
         * 
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {} 
         */
        public backBind(parentElement: HTMLElement): void {

            var elements = this.getMatchingElements(parentElement, 'data-dp');
            // back binding of datepickers
            this.traverseBackbind<IDatepickerDescriptor>(elements, parentElement, this._datepickersQueue, 'data-dp', (b, e) => {
                this._dateService.createDatePicker(e, b.IsNullable);
                this.Delegator.subscribeDestroy(e, {
                    Callback: this._dateService.destroyDatePicker,
                    CallbackArguments: [],
                    Target: this._dateService
                });
            });

            elements = this.getMatchingElements(parentElement, 'data-mrk');
            // back binding of componens needed HTML elements
            this.traverseBackbind<IMarkDescriptor>(elements, parentElement, this._markQueue, 'data-mrk', (b, e) => {
                var target = this._stealer || b.ElementReceiver;
                if (Object.prototype.toString.call(b.ElementReceiver[b.FieldName]) === '[object Array]') {
                    target[b.FieldName].push(e);
                } else if (b.Key != null && b.Key != undefined) {
                    if (typeof b.ElementReceiver[b.FieldName] === 'object') {
                        target[b.FieldName][b.Key] = e;
                    }
                } else {
                    target[b.FieldName] = e;
                }
            });

            elements = this.getMatchingElements(parentElement, `data-evb`);
            // backbinding of events
            this.traverseBackbind<IEventDescriptor>(elements, parentElement, this._eventsQueue, 'data-be', (subscription, element) => {
                for (var j: number = 0; j < subscription.Functions.length; j++) {
                    var bindFn: string = subscription.Functions[j];
                    var handler: void | Object = null;
                    var target = this._stealer || subscription.EventReceiver;

                    if (target[bindFn] && (typeof target[bindFn] === 'function')) handler = subscription.EventReceiver[bindFn];
                    else {
                        var traverse = this.evalCallback(bindFn);
                        target = traverse.target;
                        handler = traverse.fn;
                    }

                    for (var k: number = 0; k < subscription.Events.length; k++) {
                        if (subscription.Events[k].length > 4 && subscription.Events[k].substring(0, 4) === 'out-') {
                            this.Delegator.subscribeOutOfElementEvent(element, subscription.Events[k].substring(4), handler, target, subscription.EventArguments);
                        } else {
                            this.Delegator.subscribeEvent(element, subscription.Events[k], handler, target, subscription.EventArguments);
                        }
                    }

                }
            });

            if (this._hasVisualStates) {
                var targetPendingNormal: any[] = [];
                for (var vsk in this._cachedVisualStates) {
                    if (this._cachedVisualStates.hasOwnProperty(vsk)) {
                        var state = this._cachedVisualStates[vsk];
                        elements = this.getMatchingElements(parentElement, `data-state-${vsk}`);
                        for (var i = 0; i < elements.length; i++) {
                            var element = elements[i];
                            state[i].Element = element;
                            element.removeAttribute(`data-state-${vsk}`);

                            var target = <{ VisualStates: VisualState }>this._stealer || state[i].Receiver;
                            if (targetPendingNormal.indexOf(target) < 0) {
                                targetPendingNormal.push(target);
                                target.VisualStates = new VisualState();
                            }
                            if (!target.VisualStates) target.VisualStates = new VisualState();
                            if (!target.VisualStates.States.hasOwnProperty(vsk)) target.VisualStates.States[vsk] = [];
                            target.VisualStates.States[vsk].push(state[i]);
                        }
                    }
                }
                this._hasVisualStates = false;
                this.resolveNormalStates(targetPendingNormal);
                this._cachedVisualStates = {};
            }

            elements = this.getMatchingElements(parentElement, `data-cb`);
            this.traverseBackbind<ICallbackDescriptor>(elements, parentElement, this._callbacksQueue, 'data-cb', (b, e) => {
                var t = this.evalCallback(b.Callback);
                (t.fn).apply(t.target, [e].concat(b.CallbackArguments));
            });

            elements = this.getMatchingElements(parentElement, `data-dcb`);
            this.traverseBackbind<ICallbackDescriptor>(elements, parentElement, this._destroyCallbacksQueue, 'data-dcb', (b, e) => {
                var tp = this.evalCallback(b.Callback);
                this.Delegator.subscribeDestroy(e, {
                    CallbackArguments: b.CallbackArguments,
                    Target: tp.target,
                    Callback: tp.fn
                });
            });

            this._markQueue = [];
            this._eventsQueue = [];
            this._datepickersQueue = [];
        }


        private evalCallback(calbackString: any): { fn: any, target: any } {
            if (typeof calbackString === "function") return { fn: calbackString, target: window };
            if (calbackString.trim().substr(0, 'function'.length) === 'function') {
                var cb: any = null;
                eval(`cb = (${calbackString});`);
                return { fn: cb, target: window };
            }

            var tp = this.traverseWindowPath(calbackString);
            if (typeof tp.target !== "function") throw new Error(`${calbackString} supplied for rendering callback is not a function`);
            return { fn: tp.target, target: tp.parent };
        }

        private traverseWindowPath(path: string): { target: any, parent: any } {
            if (path.indexOf('.') > -1) {
                var pth = path.split('.');
                var parent = window;
                var target = window;
                for (var i = 0; i < pth.length; i++) {
                    parent = target;
                    target = parent[pth[i]];
                }
                return { target: target, parent: parent };
            } else {
                return { target: window[path], parent: window };
            }
        }
        private resolveNormalStates(targets: { VisualStates: VisualState }[]) {
            for (var i = 0; i < targets.length; i++) {
                this.addNormalState(targets[i].VisualStates.States, targets[i]);
            }
        }

        private addNormalState(states: { [key: string]: IState[] }, target: any) {
            var normalState: IState[] = [];
            var trackedElements: HTMLElement[] = [];
            for (var sk in states) {
                if (states.hasOwnProperty(sk)) {
                    for (var i = 0; i < states[sk].length; i++) {
                        var stateIdx = trackedElements.indexOf(states[sk][i].Element);
                        if (stateIdx < 0) {
                            stateIdx = normalState.length;
                            trackedElements.push(states[sk][i].Element);
                            var newEntry: IState = {
                                Element: states[sk][i].Element,
                                attrs: {},
                                classes: [],
                                styles: {},
                                id: 'normal',
                                Receiver: target,
                                content: (states[sk][i].content != null && states[sk][i].content.length > 0) ? states[sk][i].Element.innerHTML : null
                            };
                            normalState.push(newEntry);
                            for (var j = 0; j < newEntry.Element.classList.length; j++) {
                                newEntry.classes.push(newEntry.Element.classList.item(j));
                            }
                        }
                        this.mixinToNormal(normalState[stateIdx], states[sk][i]);
                    }
                }
            }
            states['_normal'] = normalState;
        }

        private mixinToNormal(normal: IState, custom: IState) {
            if (custom.attrs) {
                for (var attrKey in custom.attrs) {
                    if (custom.attrs.hasOwnProperty(attrKey)) {
                        if (!normal.attrs.hasOwnProperty(attrKey)) {
                            normal.attrs[attrKey] = (!normal.Element.hasAttribute(attrKey)) ?
                                null : normal.Element.getAttribute(attrKey);
                        }
                    }
                }
            }
            if (custom.styles) {
                for (var styleKey in custom.styles) {
                    if (custom.styles.hasOwnProperty(styleKey)) {
                        if (!normal.styles.hasOwnProperty(styleKey)) {
                            normal.styles[styleKey] = normal.Element.style.getPropertyValue(styleKey);
                        }
                    }
                }
            }
        }

        private bindEventHelper(): string {
            var commaSeparatedFunctions = arguments[0];
            var commaSeparatedEvents = arguments[1];
            var eventArgs: any[] = [];
            if (arguments.length > 3) {
                for (var i: number = 2; i <= arguments.length - 2; i++) {
                    eventArgs.push(arguments[i]);
                }
            }
            var ed: IEventDescriptor = <IEventDescriptor>{
                EventReceiver: this._stack.Current.Object,
                Functions: commaSeparatedFunctions.split(','),
                Events: commaSeparatedEvents.split(','),
                EventArguments: eventArgs
            };
            var index: number = this._eventsQueue.length;
            this._eventsQueue.push(ed);
            return `data-be-${index}="${index}" data-evb="true"`;
        }

        private renderCallbackHelper(): string {
            var fn = arguments[0];
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var index: number = this._callbacksQueue.length;
            this._callbacksQueue.push({
                Callback: fn,
                CallbackArguments: args,
                Target: window
            });
            return `data-cb="${index}"`;
        }

        private destroyCallbackHelper(): string {
            var fn = arguments[0];
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }
            var index: number = this._destroyCallbacksQueue.length;
            this._destroyCallbacksQueue.push({
                Callback: fn,
                CallbackArguments: args,
                Target: window
            });
            return `data-dcb="${index}"`;
        }

        private markHelper(fieldName: string, key: string, receiverPath: string): string {
            var index: number = this._markQueue.length;
            var receiver = this._stack.Current.Object;
            if (receiverPath != null) {
                var tp = this.traverseWindowPath(receiverPath);
                receiver = tp.target;
            }
            var md: IMarkDescriptor = <IMarkDescriptor>{
                ElementReceiver: receiver,
                FieldName: fieldName,
                Key: key
            };
            this._markQueue.push(md);
            return `data-mrk="${index}"`;
        }
        private datepickerHelper(columnName: string, forceNullable: boolean): string {
            var index: number = this._datepickersQueue.length;
            if (this._instances.Columns[columnName].IsDateTime) {
                var md: IDatepickerDescriptor = <IDatepickerDescriptor>{
                    ElementReceiver: this._stack.Current.Object,
                    IsNullable: forceNullable || this._instances.Columns[columnName].Configuration.IsNullable
                };
                this._datepickersQueue.push(md);
                return `data-dp="${index}"`;
            }
            return '';
        }

        private visualStateHelper(stateName: string, stateJson: string): string {
            var state = <IState>JSON.parse(stateJson);
            state.Receiver = this._stack.Current.Object;
            if (!this._cachedVisualStates[stateName]) this._cachedVisualStates[stateName] = [];
            var index = this._cachedVisualStates[stateName].length;
            this._cachedVisualStates[stateName].push(state);
            this._hasVisualStates = true;
            return `data-state-${stateName}="${index}"`;
        }

        public destroyDatepickers(e: HTMLElement) {

        }
    }

    interface IMarkDescriptor {
        ElementReceiver: any;
        FieldName: string;
        Key: any;
    }

    interface IDatepickerDescriptor {
        ElementReceiver: any;
        IsNullable: boolean;
    }

    export interface ICallbackDescriptor {
        Element?: HTMLElement;
        Callback: any; // function or function name
        CallbackArguments: any[];
        Target: any;
    }

    /**
     * Descriptor for event from events queue
     */
    interface IEventDescriptor {
        /**
         * Event target. 
         * Plugin, cell, header etc. Table entity that will receive event
         */
        EventReceiver: any;
        /**
         * Event handlers that will be called
         */
        Functions: string[];
        /**
         * DOM events that will trigger handler call
         */
        Events: string[];

        /**
         * Event argumetns
         */
        EventArguments: any[];
    }

    export interface IState {
        Element: HTMLElement,
        Receiver: any;
        id: string;
        classes: string[];
        attrs: { [key: string]: string };
        styles: { [key: string]: string };
        content: string;
    }

    /**
    * Event that was bound from template
    */
    export interface ITemplateBoundEvent {
        /**
         * Element triggered particular event
         */
        Element: HTMLElement;

        /**
         * Original DOM event
         */
        EventObject: Event;

        /**
         * Event received (to avoid using "this" in come cases)
         */
        Receiver: any;

        /**
         * Event argumetns
         */
        EventArguments: any[];
    }
}