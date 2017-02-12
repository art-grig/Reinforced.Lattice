declare module PowerTables {
    class EventsDelegator {
        constructor(locator: PowerTables.Rendering.DOMLocator, bodyElement: HTMLElement, layoutElement: HTMLElement, rootId: string);
        private static addHandler(element, type, handler);
        private static removeHandler(element, type, handler);
        private _rootId;
        private _locator;
        private _bodyElement;
        private _layoutElement;
        private _outSubscriptions;
        private _cellDomSubscriptions;
        private _rowDomSubscriptions;
        private _matches;
        private _domEvents;
        private _outEvents;
        private _destroyCallbacks;
        private ensureEventSubscription(eventId);
        private ensureOutSubscription(eventId);
        private traverseAndFire(subscriptions, path, args);
        private onTableEvent(e);
        /**
         * Subscribe handler to any DOM event happening on particular table cell
         *
         * @param subscription Event subscription
         */
        subscribeCellEvent(subscription: IUiSubscription<ICellEventArgs>): void;
        /**
         * Subscribe handler to any DOM event happening on particular table row.
         * Note that handler will fire even if particular table cell event happened
         *
         * @param subscription Event subscription
         */
        subscribeRowEvent(subscription: IUiSubscription<IRowEventArgs>): void;
        private parseEventId(eventId);
        private filterEvent(e, propsObject);
        private _directSubscriptions;
        subscribeEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]): void;
        private onOutTableEvent(e);
        subscribeOutOfElementEvent(el: HTMLElement, eventId: string, handler: any, receiver: any, eventArguments: any[]): void;
        subscribeDestroy(e: HTMLElement, callback: PowerTables.Rendering.ICallbackDescriptor): void;
        handleElementDestroy(e: HTMLElement): void;
        private collectElementsHavingAttribute(parent, attribute);
    }
    interface IRowEventArgs {
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
    interface ICellEventArgs extends IRowEventArgs {
        /**
         * Column index related to particular cell.
         * Column object can be restored using Table.InstanceManager.getUiColumns()[ColumnIndex]
         */
        ColumnIndex: number;
    }
    interface ISubscription {
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
        filter?: {
            [key: string]: any;
        };
    }
    /**
     * Information about UI subscription
     */
    interface IUiSubscription<TEventArgs> extends ISubscription {
        /**
         * Event handler
         *
         * @param e Event arguments
         */
        Handler: (e: TEventArgs) => any;
    }
}
