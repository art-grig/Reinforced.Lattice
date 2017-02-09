module PowerTables {
    /**
     * Wrapper for table event with ability to subscribe/unsubscribe
     */
    export class TableEvent<TBeforeEventArgs, TAfterEventArgs> {

        /*
         * @internal
         */
        constructor(masterTable: any) { this._masterTable = masterTable; }

        private _masterTable: IMasterTable;

        private _beforeCount: number = 0;
        private _afterCount: number = 0;
        private _handlersAfter: { [key: string]: ((e: ITableEventArgs<TAfterEventArgs>) => any)[] } = {};
        private _handlersBefore: { [key: string]: ((e: ITableEventArgs<TBeforeEventArgs>) => any)[] } = {};

        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invokeBefore(thisArg: any, eventArgs: TBeforeEventArgs): void {
            if (this._beforeCount === 0) return;
            var ea: ITableEventArgs<TBeforeEventArgs> = {
                MasterTable: this._masterTable,
                EventArgs: eventArgs,
                EventDirection: EventDirection.Before
            };
            var hndlrs: { [index: string]: { (e: ITableEventArgs<TBeforeEventArgs>): any; }[]; } = this._handlersBefore;
            var i: number = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers: { (e: ITableEventArgs<TBeforeEventArgs>): any; }[] = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, [ea]);
                    }
                    i = 0;
                }
            }
        }


        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invokeAfter(thisArg: any, eventArgs: TAfterEventArgs): void {
            if (this._afterCount === 0) return;
            var ea: ITableEventArgs<TAfterEventArgs> = {
                MasterTable: this._masterTable,
                EventArgs: eventArgs,
                EventDirection: EventDirection.After
            };
            var hndlrs: { [index: string]: { (e: ITableEventArgs<TAfterEventArgs>): any; }[]; } = this._handlersAfter;
            var i: number = 0;
            for (var k in hndlrs) {
                if (hndlrs.hasOwnProperty(k)) {
                    var kHandlers: { (e: ITableEventArgs<TAfterEventArgs>): any; }[] = hndlrs[k];
                    for (i = 0; i < kHandlers.length; i++) {
                        (<any>kHandlers[i]).apply(thisArg, [ea]);
                    }
                    i = 0;
                }
            }
        }


        /**
         * Invokes event with overridden this arg and specified event args
         * 
         * @param thisArg "this" argument to be substituted to callee
         * @param eventArgs Event args will be passed to callee
         */
        public invoke(thisArg: any, eventArgs: TAfterEventArgs): void {
            this.invokeAfter(thisArg, eventArgs);
        }

        /**
         * Subscribes specified function to AFTER event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribeAfter(handler: (e: ITableEventArgs<TAfterEventArgs>) => any, subscriber: string): void;
        
        public subscribeAfter(handler: any, subscriber?: string): void {
            if (!this._handlersAfter[subscriber]) {
                this._handlersAfter[subscriber] = [];
            }
            this._handlersAfter[subscriber].push(handler);
            this._afterCount++;
        }

        /**
         * Subscribes specified function to AFTER event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribe(handler: (e: ITableEventArgs<TAfterEventArgs>) => any, subscriber: string): void {
            this.subscribeAfter(handler, subscriber);
        }

        /**
         * Subscribes specified function to BEFORE event with supplied string key. 
         * Subscriber key is needed to have an ability to unsubscribe from event 
         * and should reflect entity that has been subscriben
         * 
         * @param handler Event handler to subscribe
         * @param subscriber Subscriber key to associate with handler
         */
        public subscribeBefore(handler: (e: ITableEventArgs<TBeforeEventArgs>) => any, subscriber: string): void {
            if (!this._handlersBefore[subscriber]) {
                this._handlersBefore[subscriber] = [];
            }
            this._handlersBefore[subscriber].push(handler);
            this._beforeCount++;
        }

        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        public unsubscribe(subscriber: string): void {
            this.unsubscribeBefore(subscriber);
            this.unsubscribeAfter(subscriber);
        }

        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        public unsubscribeAfter(subscriber: string): void {
            this._handlersAfter[subscriber] = null;
            delete this._handlersAfter[subscriber];
            this._afterCount--;
        }

        /**
         * Unsubscribes specified addressee from event
         * @param subscriber Subscriber key associated with handler
         */
        public unsubscribeBefore(subscriber: string): void {
            this._handlersBefore[subscriber] = null;
            delete this._handlersBefore[subscriber];
            this._beforeCount--;
        }
    }
} 