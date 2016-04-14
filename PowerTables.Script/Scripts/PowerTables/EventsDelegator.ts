﻿module PowerTables {
    import DOMLocator = PowerTables.Rendering.DOMLocator;

    export class EventsDelegatator {
        constructor(locator: DOMLocator, bodyElement: HTMLElement, layoutElement: HTMLElement, rootId: string) {
            this._locator = locator;
            this._bodyElement = bodyElement;
            this._layoutElement = layoutElement;
            this._rootId = rootId;

            this._attachFn = document['addEventListener'] || document['attachEvent'];
            this._matches = (function (el: any) {
                if (!el) return null;
                var p = el.prototype;
                return (p.matches || p.matchesSelector || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || p.oMatchesSelector);
            } (Element));
        }

        private _rootId: string;
        private _locator: DOMLocator;
        private _bodyElement: HTMLElement;
        private _layoutElement: HTMLElement;

        private _outSubscriptions: { [key: string]: IOutSubscription[] } = {}

        private _cellDomSubscriptions: { [key: string]: ISubscription[] } = {};
        private _rowDomSubscriptions: { [key: string]: ISubscription[] } = {};
        private _attachFn: (eventId: string, handler: (e: UIEvent) => any) => void;
        private _matches: (e: HTMLElement) => boolean;
        private _domEvents: { [key: string]: any } = {};
        private _outEvents: { [key: string]: any } = {};

        private ensureEventSubscription(eventId: string) {
            if (this._domEvents.hasOwnProperty(eventId)) return;
            var fn = this.onTableEvent.bind(this);
            this._attachFn.call(this._bodyElement, eventId, fn);
            this._domEvents[eventId] = fn;
        }

        private ensureOutSubscription(eventId: string) {
            if (this._outEvents.hasOwnProperty(eventId)) return;
            var fn = this.onOutTableEvent.bind(this);
            this._attachFn.call(this._layoutElement, eventId, fn);
            this._outEvents[eventId] = fn;
        }

        private traverseAndFire(subscriptions: ISubscription[], path: any[], args: any) {
            for (var i: number = 0; i < subscriptions.length; i++) {
                
                if (subscriptions[i].Selector) {
                    for (var j: number = 0; j < path.length; j++) {
                        if (this._matches.call(path[j], `#${this._rootId} ${subscriptions[i].Selector}`)) {
                            if (this.filterEvent(args['OriginalEvent'], subscriptions[i].filter)) {
                                subscriptions[i].Handler(args);
                                break;
                            }
                        }
                    }
                } else {
                    subscriptions[i].Handler(args);
                }
            }
        }

        private onTableEvent(e: UIEvent) {
            var t: HTMLElement = <HTMLElement>(e.target || e.srcElement), eventType = e.type;
            var forRow: ISubscription[] = this._rowDomSubscriptions[eventType];
            var forCell: ISubscription[] = this._cellDomSubscriptions[eventType];

            if (!forRow) forRow = [];
            if (!forCell) forCell = [];

            if (forRow.length === 0 && forCell.length === 0) return;
            var pathToCell: any[] = [];
            var pathToRow: any[] = [];
            var cellLocation: ICellLocation = null, rowIndex: number = null;

            while (t !== this._bodyElement) {
                if (this._locator.isCell(t)) cellLocation = TrackHelper.getCellLocation(t);
                if (this._locator.isRow(t)) rowIndex = TrackHelper.getRowIndex(t);

                if (cellLocation == null) pathToCell.push(t);
                if (rowIndex == null) pathToRow.push(t);

                t = t.parentElement;
                if (t.parentElement == null) {
                    // we encountered event on detached element
                    // just return
                    return;
                }
            }

            if (cellLocation != null) {
                var cellArgs: ICellEventArgs = {
                    OriginalEvent: e,
                    DisplayingRowIndex: cellLocation.RowIndex,
                    ColumnIndex: cellLocation.ColumnIndex
                };
                this.traverseAndFire(forCell, pathToCell, cellArgs);
            }

            if (rowIndex != null) {
                var rowArgs: IRowEventArgs = {
                    OriginalEvent: e,
                    DisplayingRowIndex: rowIndex
                };
                this.traverseAndFire(forRow, pathToRow, rowArgs);
            }
        }


        /**
         * Subscribe handler to any DOM event happening on particular table cell
         * 
         * @param subscription Event subscription
         */
        public subscribeCellEvent(subscription: IUiSubscription<ICellEventArgs>): void {
            var eo = this.parseEventId(subscription.EventId);
            subscription.EventId = eo['__event'];
            subscription.filter = eo;

            if (!this._cellDomSubscriptions[subscription.EventId]) {
                this._cellDomSubscriptions[subscription.EventId] = [];
            }
            this._cellDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        }

        /**
         * Subscribe handler to any DOM event happening on particular table row. 
         * Note that handler will fire even if particular table cell event happened
         * 
         * @param subscription Event subscription
         */
        public subscribeRowEvent(subscription: IUiSubscription<IRowEventArgs>) {
            var eo = this.parseEventId(subscription.EventId);
            subscription.EventId = eo['__event'];
            subscription.filter = eo;
            if (!this._rowDomSubscriptions[subscription.EventId]) {
                this._rowDomSubscriptions[subscription.EventId] = [];
            }
            this._rowDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        }

        // custom events like |key=b`value`|keyup
        // b is type bool
        // b,s,i,f available
        private parseEventId(eventId: string): { [key: string]: any } {
            if (eventId.indexOf('|') < 0) return { __event: eventId, __no: true };
            var eo: { [key: string]: any } = {};
            if (eventId.substr(0, '|'.length) === '|') {
                var evtSplit = eventId.split('|');
                eo['__event'] = evtSplit[evtSplit.length];
                for (var i = 0; i < evtSplit.length; i++) {
                    var eqidx = evtSplit[i].indexOf('=');
                    var key = evtSplit[i].substring(0, eqidx);
                    var right = evtSplit[i].substring(eqidx + 1);
                    var rightRaw = right.substring(2, right.length - 1);

                    var val;
                    switch (right.charAt(0)) {
                        case 'b': val = (rightRaw.toUpperCase() === 'TRUE');
                            break;
                        case 'i': val = parseInt(rightRaw);
                            break;
                        case 'f': val = parseFloat(rightRaw);
                            break;
                        default:
                            val = rightRaw;
                    }
                    eo[key] = val;
                }
            }
            return eo;
        }

        private filterEvent(e: Event, propsObject: { [key: string]: any }): boolean {
            if (propsObject['__no']) return true;
            for (var p in propsObject) {
                if (e[p] !== propsObject[p]) return false;
            }
            return true;
        }

        public subscribeEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]) {
            var eo = this.parseEventId(eventId);
            if (!eo['__no']) {
                eventId = eo['__event'];
                var mef = this.filterEvent;
                this._attachFn.call(el, eventId, (e: any) => {
                    if (!mef(e, eo)) return;
                    handler.apply(receiver, [
                        {
                            Element: el,
                            EventObject: e,
                            Receiver: receiver,
                            EventArguments: eventArguments
                        }
                    ]);
                });
            } else {
                this._attachFn.call(el, eventId, (e: any) => {
                    handler.apply(receiver, [
                        {
                            Element: el,
                            EventObject: e,
                            Receiver: receiver,
                            EventArguments: eventArguments
                        }
                    ]);
                });
            }
        }

        private onOutTableEvent(e: UIEvent) {
            var subscriptions = this._outSubscriptions[e.type];
            var target = <HTMLElement>(e.target || e.srcElement);
            for (var i = 0; i < subscriptions.length; i++) {
                var sub = subscriptions[i];
                var ct = target;
                var found = false;
                while (ct !== this._layoutElement) {
                    if (ct === sub.Element) {
                        found = true;
                        break;
                    }
                    ct = ct.parentElement;
                    if (ct.parentElement == null) {
                        return;
                    }
                }
                if (!found) {
                    if (this.filterEvent(e, sub.filter)) {
                        sub.EventObject = e;
                        sub.handler.apply(sub.Receiver, sub);
                    }
                }
            }
        }

        public subscribeOutOfElementEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]) {
            var eo = this.parseEventId(eventId);
            eventId = eo['__event'];
            this.ensureOutSubscription(eventId);
            if (!this._outSubscriptions.hasOwnProperty(eventId)) this._outSubscriptions[eventId] = [];
            this._outSubscriptions[eventId].push({
                Element: el,
                EventArguments: eventArguments,
                EventObject: null,
                Receiver: receiver,
                handler: handler,
                filter:eo
            });
        }

        public unsubscribeRedundantEvents(e: HTMLElement) {
            var arr: HTMLElement[] = this.collectElementsHavingAttribute(e, 'data-outlistener');
            if (arr.length !== 0) {

                for (var os in this._outSubscriptions) {
                    var sub = this._outSubscriptions[os];
                    for (var j = 0; j < sub.length; j++) {
                        if (arr.indexOf(sub[j].Element) > -1) {
                            sub.splice(j, 1);
                            break;
                        }
                    }
                    if (this._outSubscriptions[os].length === 0) {
                        this._layoutElement.removeEventListener(os, this._outEvents[os]);
                        delete this._outEvents[os];
                    }
                }
            }
        }

        private collectElementsHavingAttribute(parent: HTMLElement, attribute: string): HTMLElement[] {
            var matching = parent.querySelectorAll(`[${attribute}]`);
            var arr: HTMLElement[] = [];
            for (var i = 0; i < matching.length; i++) {
                arr.push(<HTMLElement>matching[i]);
            }
            if (parent.hasAttribute(attribute)) arr.push(parent);
            return arr;
        }
    }

    interface IOutSubscription {
        Element: HTMLElement;
        EventObject: Event;
        Receiver: any;
        EventArguments: any[];
        handler: any;
        filter: { [key: string]: any };
    }

    export interface IRowEventArgs {
        /**
         * Original event reference
         */
        OriginalEvent: Event;

        /**
         * Row index. 
         * Data object can be restored using Table.DataHolder.localLookupDisplayedData(RowIndex)
         */
        DisplayingRowIndex: number;
    }

    /**
     * Event arguments for particular cell event
     */
    export interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column index related to particular cell. 
         * Column object can be restored using Table.InstanceManager.getUiColumns()[ColumnIndex]
         */
        ColumnIndex: number;
    }

    export interface ISubscription {
        /**
         * Event Id
         */
        EventId: string;
        /**
         * Selector of element
         */
        Selector?: string;
        /**
         * Subscription ID (for easier unsubscribe)
         */
        SubscriptionId: string;

        Handler: any;

        filter?: { [key: string]: any };
    }

    /**
     * Information about UI subscription
     */
    export interface IUiSubscription<TEventArgs> extends ISubscription {
        /**
         * Event handler 
         * 
         * @param e Event arguments 
         */
        Handler: (e: TEventArgs) => any;
    }
} 