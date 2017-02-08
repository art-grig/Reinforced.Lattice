module PowerTables.Rendering {
    /**
     * Internal component that is not supposed to be used directly.
     */
    export class BackBinder {
        private _dateService: PowerTables.Services.DateService;
        public Delegator: PowerTables.Services.EventsDelegatorService;

        /**
        * @internal
        */
        constructor(dateService: PowerTables.Services.DateService) {
            this._dateService = dateService;
        }
        
        /**
         * Applies binding of events left in events queue
         * 
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {} 
         */
        public backBind(parentElement: HTMLElement, info: PowerTables.Templating.IBackbindInfo): void {
            this.backbindDatepickers(parentElement,info);
            this.backbindMark(parentElement,info);
            this.backbindEvents(parentElement,info);
            this.backbindVisualStates(parentElement, info);
            this.backbindCallbacks(parentElement,info);
            
        }

        //#region Common backbinder traversal routine
        private traverseBackbind<T>(elements: HTMLElement[], parentElement: HTMLElement, backbindCollection: T[], attribute: string, fn: (backbind: T, element: HTMLElement) => void) {
            for (var i: number = 0; i < elements.length; i++) {
                var element: HTMLElement = elements[i];
                var attr = null;
                var attrNamesToRemove = [];
                for (var j = 0; j < element.attributes.length; j++) {
                    if (element.attributes.item(j).name.substring(0, attribute.length) === attribute) {
                        attr = element.attributes.item(j);
                        var idx: number = parseInt(attr.value);
                        var backbindDescription: T = backbindCollection[idx];
                        fn.call(this, backbindDescription, element);
                        attrNamesToRemove.push(attr.name);
                    }
                }
                for (var k = 0; k < attrNamesToRemove.length; k++) {
                    element.removeAttribute(attrNamesToRemove[k]);
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
        //#endregion

        //#region Datepickers
        private backbindDatepickers(parentElement: HTMLElement, info: PowerTables.Templating.IBackbindInfo) {
            var elements = this.getMatchingElements(parentElement, 'data-dp');
            // back binding of datepickers
            this.traverseBackbind<PowerTables.Templating.IBackbindDatepicker>(elements, parentElement, info.DatepickersQueue, 'data-dp', (b, e) => {
                this._dateService.createDatePicker(e, b.IsNullable);
                this.Delegator.subscribeDestroy(e, {
                    Callback: this._dateService.destroyDatePicker,
                    CallbackArguments: [],
                    Target: this._dateService
                });
            });


        }
        //#endregion

        //#region Marks
        private backbindMark(parentElement: HTMLElement, info: PowerTables.Templating.IBackbindInfo) {
            var elements = this.getMatchingElements(parentElement, 'data-mrk');
            // back binding of componens needed HTML elements
            this.traverseBackbind<PowerTables.Templating.IBackbindMark>(elements, parentElement, info.MarkQueue, 'data-mrk', (b, e) => {
                var target = b.ElementReceiver;
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

        }
        //#endregion

        //#region Callbacks
        private backbindCallbacks(parentElement: HTMLElement, info: PowerTables.Templating.IBackbindInfo) {
            var elements = this.getMatchingElements(parentElement, `data-cb`);
            this.traverseBackbind<PowerTables.Templating.IBackbindCallback>(elements, parentElement, info.CallbacksQueue, 'data-cb', (b, e) => {
                var t = this.evalCallback(b.Callback);
                (t.fn).apply(t.target, [e].concat(b.CallbackArguments));
            });

            elements = this.getMatchingElements(parentElement, `data-dcb`);
            this.traverseBackbind<PowerTables.Templating.IBackbindCallback>(elements, parentElement, info.DestroyCallbacksQueue, 'data-dcb', (b, e) => {
                var tp = this.evalCallback(b.Callback);
                this.Delegator.subscribeDestroy(e, {
                    CallbackArguments: b.CallbackArguments,
                    Target: tp.target,
                    Callback: tp.fn
                });
            });
        }

        //#endregion

        //#region Events
        private backbindEvents(parentElement: HTMLElement, info: PowerTables.Templating.IBackbindInfo) {
            var elements = this.getMatchingElements(parentElement, `data-evb`);
            // backbinding of events
            this.traverseBackbind<PowerTables.Templating.IBackbindEvent>(elements, parentElement, info.EventsQueue, 'data-be',
                (subscription, element) => {
                for (var j: number = 0; j < subscription.Functions.length; j++) {
                    var bindFn: string = subscription.Functions[j];
                    var handler: void | Object = null;
                    var target = subscription.EventReceiver;

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
        }

        private evalCallback(calbackString: any): { fn: any, target: any } {
            if (typeof calbackString === "function") return { fn: calbackString, target: window };
            if (calbackString.trim().substr(0, 'function'.length) === 'function') {
                var cb: any = null;
                eval(`cb = (${calbackString});`);
                return { fn: cb, target: window };
            }

            var tp = BackBinder.traverseWindowPath(calbackString);
            if (typeof tp.target !== "function") throw new Error(`${calbackString} supplied for rendering callback is not a function`);
            return { fn: tp.target, target: tp.parent };
        }

        public static traverseWindowPath(path: string): { target: any, parent: any } {
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
        //#endregion

        //#region Visual States
        private backbindVisualStates(parentElement: HTMLElement, info: PowerTables.Templating.IBackbindInfo) {
            if (info.HasVisualStates) {
                var targetPendingNormal: any[] = [];
                for (var vsk in info.CachedVisualStates) {
                    if (info.CachedVisualStates.hasOwnProperty(vsk)) {
                        var state = info.CachedVisualStates[vsk];
                        var elements = this.getMatchingElements(parentElement, `data-state-${vsk}`);
                        for (var i = 0; i < elements.length; i++) {
                            var element = elements[i];
                            state[i].Element = element;
                            element.removeAttribute(`data-state-${vsk}`);

                            var target = <{ VisualStates: VisualState }>state[i].Receiver;
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
                info.HasVisualStates = false;
                this.resolveNormalStates(targetPendingNormal);
                info.CachedVisualStates = {};
            }
        }


        private resolveNormalStates(targets: { VisualStates: VisualState }[]) {
            for (var i = 0; i < targets.length; i++) {
                this.addNormalState(targets[i].VisualStates.States, targets[i]);
            }
        }

        
        private addNormalState(states: { [key: string]: PowerTables.Templating.IState[] }, target: any) {
            var normalState: PowerTables.Templating.IState[] = [];
            var trackedElements: HTMLElement[] = [];
            for (var sk in states) {
                if (states.hasOwnProperty(sk)) {
                    for (var i = 0; i < states[sk].length; i++) {
                        var stateIdx = trackedElements.indexOf(states[sk][i].Element);
                        if (stateIdx < 0) {
                            stateIdx = normalState.length;
                            trackedElements.push(states[sk][i].Element);
                            var newEntry: PowerTables.Templating.IState = {
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

        private mixinToNormal(normal: PowerTables.Templating.IState, custom: PowerTables.Templating.IState) {
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
        //#endregion
    }

    
}