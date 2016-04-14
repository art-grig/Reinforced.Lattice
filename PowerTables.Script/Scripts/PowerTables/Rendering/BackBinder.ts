module PowerTables.Rendering {
    export class BackBinder {
        private _eventsQueue: IEventDescriptor[] = [];
        private _markQueue: IMarkDescriptor[] = [];
        private _datepickersQueue: IDatepickerDescriptor[] = [];
        private _instances: InstanceManager;
        private _stack: RenderingStack;
        private _dateService: DateService;
        private _stealer: any;
        private _cachedVisualStates: { [key: string]: IState[] } = {};
        private _hasVisualStates: boolean = false;

        public Delegator: EventsDelegatator;

        constructor(hb: Handlebars.IHandlebars, instances: InstanceManager, stack: RenderingStack, dateService: DateService) {
            this._instances = instances;
            hb.registerHelper('BindEvent', this.bindEventHelper.bind(this));
            hb.registerHelper('Mark', this.markHelper.bind(this));
            hb.registerHelper('Datepicker', this.datepickerHelper.bind(this));
            hb.registerHelper('VState', this.visualStateHelper.bind(this));

            this._stack = stack;
            this._dateService = dateService;
        }

        

        public steal(stealer:any,parentElement:HTMLElement) {
            this._stealer = stealer;
            this.backBind(parentElement);

            this._stealer = null;
        }


        private traverseBackbind<T>(parentElement: HTMLElement, backbindCollection: T[], attribute: string, fn: (backbind: T, element: HTMLElement) => void) {
            var elements: NodeList = parentElement.querySelectorAll(`[${attribute}]`);
            for (var i: number = 0; i < elements.length; i++) {
                var element: HTMLElement = <HTMLElement>elements.item(i);
                var idx: number = parseInt(element.getAttribute(attribute));
                var backbindDescription: T = backbindCollection[idx];
                fn.call(this, backbindDescription, element);
                element.removeAttribute(attribute);
            }
            if (parentElement.hasAttribute(attribute)) {
                var meIdx: number = parseInt(parentElement.getAttribute(attribute));
                var descr: T = backbindCollection[meIdx];
                fn.call(this, descr, parentElement);
            }
        }

        /**
         * Applies binding of events left in events queue
         * 
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {} 
         */
        public backBind(parentElement: HTMLElement): void {

            // back binding of datepickers
            this.traverseBackbind<IDatepickerDescriptor>(parentElement, this._datepickersQueue, 'data-dp', (b, e) => {
                this._dateService.createDatePicker(e);
            });
            // back binding of componens needed HTML elements
            this.traverseBackbind<IMarkDescriptor>(parentElement, this._markQueue, 'data-mrk', (b, e) => {
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

            // backbinding of events
            this.traverseBackbind<IEventDescriptor>(parentElement, this._eventsQueue, 'data-be', (subscription, element) => {
                for (var j: number = 0; j < subscription.Functions.length; j++) {
                    var bindFn: string = subscription.Functions[j];
                    var handler: void | Object = null;
                    var target = this._stealer || subscription.EventReceiver;

                    if (target[bindFn] && (typeof target[bindFn] === 'function')) handler = subscription.EventReceiver[bindFn];
                    else handler = eval(bindFn);

                    for (var k: number = 0; k < subscription.Events.length; k++) {
                        if (subscription.Events[k].substring(0, 4) === 'out-') {
                            this.Delegator.subscribeOutOfElementEvent(element, subscription.Events[k], handler, target, subscription.EventArguments);
                        } else {
                            this.Delegator.subscribeEvent(element, subscription.Events[k], handler, target, subscription.EventArguments);
                        }
                    }

                }
            });

            if (this._hasVisualStates) {
                var targetPendingNormal:any[] = [];
                for (var vsk in this._cachedVisualStates) {
                    if (this._cachedVisualStates.hasOwnProperty(vsk)) {
                        var state = this._cachedVisualStates[vsk];
                        var elements = parentElement.querySelectorAll(`[data-state-${vsk}]`);
                        for (var i = 0; i < elements.length; i++) {
                            var element = <HTMLElement>elements.item(i);
                            state[i].Element = element;
                            element.removeAttribute(`data-state-${vsk}`);

                            var target = this._stealer || state[i].Receiver;
                            if (!target['VisualStates']) target['VisualStates'] = {}
                            if (!target['VisualStates'].hasOwnProperty(vsk)) target['VisualStates'][vsk] = [];
                            target['VisualStates'][vsk].push(state[i]);
                            if (targetPendingNormal.indexOf(target) < 0) targetPendingNormal.push(target);

                        }
                    }
                }
                this._hasVisualStates = false;
                this.resolveNormalStates(targetPendingNormal);
                this._cachedVisualStates = {};
            }

            this._markQueue = [];
            this._eventsQueue = [];
            this._datepickersQueue = [];
        }

        private resolveNormalStates(targets: any[]) {
            for (var i = 0; i < targets.length; i++) {
                this.addNormalState(targets[i]['VisualStates'],targets[i]);
            }
        }

        private addNormalState(states: { [key: string]: IState[] },target:any) {
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
                                Receiver: target
                            };
                            normalState.push(newEntry);
                            for (var j = 0; j < newEntry.Element.classList.length; j++) {
                                newEntry.classes.push(newEntry.Element.classList.item(j));
                            }
                        }
                        this.mixinToNormal(normalState[stateIdx],states[sk][i]); 
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
            return `data-be="${index}"`;
        }

        private markHelper(fieldName: any, key: any): string {
            var index: number = this._markQueue.length;
            var md: IMarkDescriptor = <IMarkDescriptor>{
                ElementReceiver: this._stack.Current.Object,
                FieldName: fieldName,
                Key: key
            };
            this._markQueue.push(md);
            return `data-mrk="${index}"`;
        }
        private datepickerHelper(columnName: string): string {
            var index: number = this._datepickersQueue.length;
            if (this._instances.Columns[columnName].IsDateTime) {
                var md: IDatepickerDescriptor = <IDatepickerDescriptor>{
                    ElementReceiver: this._stack.Current.Object
                };
                this._datepickersQueue.push(md);
                return `data-dp="${index}"`;
            }
            return '';
        }
        
        private visualStateHelper(stateName: string,stateJson:string): string {
            var state = <IState>JSON.parse(stateJson);
            state.Receiver = this._stack.Current.Object;
            if (!this._cachedVisualStates[stateName]) this._cachedVisualStates[stateName] = [];
            var index = this._cachedVisualStates[stateName].length;
            this._cachedVisualStates[stateName].push(state);
            this._hasVisualStates = true;
            return `data-state-${stateName}="${index}"`;
        }
    }

    interface IMarkDescriptor {
        ElementReceiver: any;
        FieldName: string;
        Key: any;
    }

    interface IDatepickerDescriptor {
        ElementReceiver: any;
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
        Receiver:any;
        id: string;
        classes: string[],
        attrs: { [key: string]: string }
        styles: { [key: string]: string }
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