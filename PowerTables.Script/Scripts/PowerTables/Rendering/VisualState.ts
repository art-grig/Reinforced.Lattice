module PowerTables.Rendering {
    /**
     * Component for managing components visual states
     */
    export class VisualState {

        /**
        * @internal
        */
        constructor() {
            this.Current = '';
        }

        public States: { [key: string]: IState[] } = {};

        /**
         * Current visual state
         */
        public Current: string;
        private _subscribers: ((evt: IStateChangedEvent) => void)[] = [];
        private _stopEvents: boolean = false;

        /**
         * Subscribes specified function to state change events
         * 
         * @param fn Function that will be called when state changes
         */
        public subscribeStateChange(fn: (evt: IStateChangedEvent) => void): void {
            this._subscribers.push(fn);
        }

        private fireHandlers(e: IStateChangedEvent) {
            if (this._stopEvents) return;
            for (var i = 0; i < this._subscribers.length; i++) {
                this._subscribers[i](e);
            }
        }

        /**
         * Applies settings for specified state  
         * 
         * @param state State id
         * @param states VisualStates collection
         */
        public changeState(state: string): void {
            this.setNormal();
            if (!this.States[state]) return;
            this.applyState(this.States[state]);
            this.fireHandlers({ State: state, CurrentState: this.Current, StateWasMixedIn: false });
        }

        /**
         * Mixins settings for specified state  
         * 
         * @param state State id
         * @param states VisualStates collection
         */
        public mixinState(state: string): void {
            if (!this.States[state]) return;
            this.Current += '+' + state;
            this.applyState(this.States[state]);
            this.fireHandlers({ State: state, CurrentState: this.Current, StateWasMixedIn: true });
        }

        /**
         * Unmixins state of current state
         * 
         * @param state State to unmixin
         * @returns {} 
         */
        public unmixinState(state: string): void {
            if (!this.States[state]) return;
            var statesHistory = this.Current.split('+');
            this._stopEvents = true;
            this.normalState();
            for (var i = 0; i < statesHistory.length; i++) {
                if (statesHistory[i] !== null && statesHistory[i].length > 0 && statesHistory[i] !== state) {
                    this.mixinState(statesHistory[i]);
                }
            }
            this._stopEvents = false;
        }

        /**
         * Reverts elements back to normal state
         * 
         * @param states VisualStates collection 
         */
        public normalState(): void {
            this.setNormal();
        }

        private applyState(desired: IState[]) {
            for (var i = 0; i < desired.length; i++) {
                var ns: IState = desired[i];
                for (var k = 0; k < ns.classes.length; k++) {
                    var cls = ns.classes[k].substring(1);
                    if (ns.classes[k].charAt(0) === '+') {
                        if (!ns.Element.classList.contains(cls)) {
                            ns.Element.classList.add(cls);
                        }
                    } else {
                        if (ns.Element.classList.contains(cls)) {
                            ns.Element.classList.remove(cls);
                        }
                    }
                }
                for (var ak in ns.attrs) {
                    if (ns.attrs.hasOwnProperty(ak)) {
                        if (ns.attrs[ak] == null) {
                            if (ns.Element.hasAttribute(ak)) ns.Element.removeAttribute(ak);
                        } else {
                            if ((!ns.Element.hasAttribute(ak)) || (ns.Element.getAttribute(ak) !== ns.attrs[ak])) {
                                ns.Element.setAttribute(ak, ns.attrs[ak]);
                            }
                        }
                    }
                }
                for (var sk in ns.styles) {
                    if (ns.styles.hasOwnProperty(sk)) {
                        if (ns.Element.style.getPropertyValue(sk) !== ns.styles[sk]) {
                            ns.Element.style.setProperty(sk, ns.styles[sk]);
                        }
                    }
                }
                if (ns.content) {
                    var html = this.getContent(ns.Receiver, ns.content);
                    if (html.length > 0) {
                        ns.Element.innerHTML = html;
                    } else {
                        ns.Element.innerHTML = html;
                    }
                }
            }
        }

        private getContent(receiver: any, contentLocation: string) {
            var path = contentLocation.split('.');
            var co = receiver;
            for (var i = 0; i < path.length; i++) {
                co = co[path[i]];
            }
            if (co == undefined) {
                throw new Error(`Visual state owner does not contain property or function ${contentLocation}`);
            }
            var html = '';
            if (typeof co === 'function') {
                html = co.call(receiver);
            } else {
                html = co;
            }
            return html;
        }

        private setNormal() {
            this.Current = 'normal';
            this.fireHandlers({ State: 'normal', CurrentState: this.Current, StateWasMixedIn: false });
            var normal = this.States['_normal'];
            for (var i = 0; i < normal.length; i++) {
                var ns = normal[i];

                var classes = ns.classes.join(' ');
                if ((!ns.Element.hasAttribute('class') && classes.length > 0) || (ns.Element.getAttribute('class') !== classes)) {
                    ns.Element.setAttribute('class', classes);
                }

                if (ns.Element.innerHTML !== ns.content && ns.content != null) ns.Element.innerHTML = ns.content;

                for (var ak in ns.attrs) {
                    if (ns.attrs.hasOwnProperty(ak)) {
                        if (ns.attrs[ak] == null) {
                            if (ns.Element.hasAttribute(ak)) ns.Element.removeAttribute(ak);
                        } else {
                            if ((!ns.Element.hasAttribute(ak)) || (ns.Element.getAttribute(ak) !== ns.attrs[ak])) {
                                ns.Element.setAttribute(ak, ns.attrs[ak]);
                            }
                        }
                    }
                }
                for (var sk in ns.styles) {
                    if (ns.styles.hasOwnProperty(sk)) {
                        if (ns.Element.style.getPropertyValue(sk) !== ns.styles[sk]) {
                            ns.Element.style.setProperty(sk, ns.styles[sk]);
                        }
                    }
                }
            }
        }
    }

    /**
    * @internal
    */
    export interface IStateChangedEvent {
        State: string;
        CurrentState: string;
        StateWasMixedIn: boolean;
    }
} 