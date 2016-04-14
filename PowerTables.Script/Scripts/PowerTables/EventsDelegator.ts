module PowerTables {
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
            var fn = this.onTableEvent.bind(this);
            this._attachFn.call(this._bodyElement, eventId, fn);
            this._domEvents[eventId] = fn;
        }

        private ensureOutSubscription(eventId: string) {
            var fn = this.onOutTableEvent.bind(this);
            this._attachFn.call(this._layoutElement, eventId, fn);
            this._outEvents[eventId] = fn;
        }

        private traverseAndFire(subscriptions: ISubscription[], path: any[], args: any) {
            for (var i: number = 0; i < subscriptions.length; i++) {
                if (subscriptions[i].Selector) {
                    for (var j: number = 0; j < path.length; j++) {
                        if (this._matches.call(path[j], `#${this._rootId} ${subscriptions[i].Selector}`)) {
                            subscriptions[i].Handler(args);
                            break;
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
            if (!this._rowDomSubscriptions[subscription.EventId]) {
                this._rowDomSubscriptions[subscription.EventId] = [];
            }
            this._rowDomSubscriptions[subscription.EventId].push(subscription);
            this.ensureEventSubscription(subscription.EventId);
        }

        public subscribeEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]) {
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
                }
                if (!found) {
                    sub.EventObject = e;
                    sub.handler.apply(sub.Receiver, sub);
                }
            }
        }


        public subscribeOutOfElementEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]) {
            this.ensureOutSubscription(eventId);
            if (!this._outSubscriptions.hasOwnProperty(eventId)) this._outSubscriptions[eventId] = [];
            this._outSubscriptions[eventId].push({
                Element: el,
                EventArguments: eventArguments,
                EventObject: null,
                Receiver: receiver,
                handler: handler
            });
        }

        public unsubscribeOutEvents(e: HTMLElement) {
            this.unsubscripeParentOutEvents(e);
            for (var os in this._outSubscriptions) {
                if (this._outSubscriptions[os].length === 0) {
                    this._layoutElement.removeEventListener(os, this._outEvents[os]);
                }
            }
        }

        private unsubscripeParentOutEvents(e: HTMLElement) {
            for (var os in this._outSubscriptions) {
                var sub = this._outSubscriptions[os];
                for (var i = 0; i < sub.length; i++) {
                    if (sub[i].Element === e) {
                        sub.splice(i, 1);
                        break;
                    }
                }
            }
            for (var j = 0; j < e.childElementCount; j++) {
                this.unsubscripeParentOutEvents(<HTMLElement>e.childNodes.item(j));
            }
        }

        
    }

    interface IOutSubscription {
        Element: HTMLElement;
        EventObject: Event;
        Receiver: any;
        EventArguments: any[];
        handler: any;
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