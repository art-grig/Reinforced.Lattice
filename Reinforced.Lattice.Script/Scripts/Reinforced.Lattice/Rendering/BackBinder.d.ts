declare module PowerTables.Rendering {
    class BackBinder {
        private _eventsQueue;
        private _markQueue;
        private _datepickersQueue;
        private _callbacksQueue;
        private _destroyCallbacksQueue;
        private _instances;
        private _stack;
        private _dateService;
        private _stealer;
        private _cachedVisualStates;
        private _hasVisualStates;
        Delegator: EventsDelegator;
        constructor(hb: Handlebars.IHandlebars, instances: InstanceManager, stack: RenderingStack, dateService: DateService);
        private traverseBackbind<T>(elements, parentElement, backbindCollection, attribute, fn);
        private getMatchingElements(parent, attr);
        /**
         * Applies binding of events left in events queue
         *
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {}
         */
        backBind(parentElement: HTMLElement): void;
        private evalCallback(calbackString);
        private traverseWindowPath(path);
        private resolveNormalStates(targets);
        private addNormalState(states, target);
        private mixinToNormal(normal, custom);
        private bindEventHelper();
        private renderCallbackHelper();
        private destroyCallbackHelper();
        private markHelper(fieldName, key, receiverPath);
        private datepickerHelper(columnName, forceNullable);
        private visualStateHelper(stateName, stateJson);
        destroyDatepickers(e: HTMLElement): void;
    }
    interface ICallbackDescriptor {
        Element?: HTMLElement;
        Callback: any;
        CallbackArguments: any[];
        Target: any;
    }
    interface IState {
        Element: HTMLElement;
        Receiver: any;
        id: string;
        classes: string[];
        attrs: {
            [key: string]: string;
        };
        styles: {
            [key: string]: string;
        };
        content: string;
    }
    /**
    * Event that was bound from template
    */
    interface ITemplateBoundEvent {
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
