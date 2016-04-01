module PowerTables {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    export class TableEvent<TEventArgs> {
        private _handlers: { [key: string]: ((e: TEventArgs) => any)[] } = {};
        
        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invoke(thisArg: any, eventArgs: TEventArgs): void {
            var hndlrs = this._handlers;
            var i = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, eventArgs);
                    }
                    i = 0;
                }
            }
        }

        /**
         * Subscribes specified function to event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribe(handler: (e: TEventArgs) => any, subscriber: string) {
            if (!this._handlers[subscriber]) {
                this._handlers[subscriber] = [];
            }
            this._handlers[subscriber].push(handler);
        }

        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        public unsubscribe(subscriber: string) {
            this._handlers[subscriber] = null;
            delete this._handlers[subscriber];
        }
    }

    /*
     * Events manager for table. 
     * Contains all available events
     */
    export class EventsManager {
        /**
         * "Before Filter Gathering" event. 
         * Occurs every time before sending request to server via Loader before 
         * filtering information is being gathered. Here you can add your own 
         * additional data to prepared query that will be probably overridden by 
         * other query providers. 
         * 
         * @this Master table
         */
        public BeforeFilterGathering: TableEvent<IQuery> = new TableEvent();

        /**
         * "After Filter Gathering" event. 
         * Occurs every time before sending request to server via Loader AFTER 
         * filtering information is being gathered. Here you can add your own 
         * additional data to prepared query that will probably override parameters 
         * set by another query providers. 
         * 
         * @this Master table
         */
        public AfterFilterGathering: TableEvent<IQuery> = new TableEvent();
    }

    /**
     * Event args for loading events
     */
    export interface ILoadingEventArgs {
        /**
         * Query to be sent to server
         */
        Query: IQuery;

        /**
         * Request object to be used while sending to server
         */
        Request:XMLHttpRequest;
    }
} 