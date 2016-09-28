module PowerTables {
    /**
     * Components container for registration/resolving plugins
     */
    export class ComponentsContainer {
        private static _components: { [key: string]: any } = {};

        /**
         * Registers component in components container for further instantiation
         * @param key Text ID for component
         * @param ctor Constructor function
         * @returns {} 
         */
        public static registerComponent(key: string, ctor: Function): void {
            this._components[key] = ctor;
        }

        /**
         * Instantiates component by its ID with specified arguments
         * @param key Text ID of desired component
         * @param args String arguments for instantiation
         * @returns {} 
         */
        public static resolveComponent<T>(key: string, args?: any[]): T {
            if (this._components[key] == null || this._components[key]==undefined)
                throw new Error(`Component ${key} is not registered. Please ensure that you have connected all the additional scripts`);

            if (!args) return new (this._components[key]);
            else {
                var ctor = this._components[key];
                var boundCtor = Function.prototype.bind.apply(ctor, [null].concat(args));
                return new boundCtor();
            }
        }

        /**
         * Registers component-provided events in particular EventsService instance.
         * It is important to register all component's events befor instantiation and .init call 
         * to make them available to subscribe each other's events.
         * 
         * Instance manager asserts that .registerEvent will be called exactly once for 
         * each component used in table
         * 
         * @param key Text ID of desired component
         * @param eventsManager Events manager instance
         * @returns {} 
         */
        public static registerComponentEvents(key: string, eventsManager: EventsService, masterTable: IMasterTable) {
            if (this._components[key] == null || this._components[key] == undefined)
                throw new Error(`Component ${key} is not registered. Please ensure that you have connected all the additional scripts`);
            if (this._components[key].registerEvents && typeof this._components[key].registerEvents === 'function') {
                this._components[key].registerEvents.call(eventsManager, eventsManager, masterTable);
            }
        }

        /*
         * @internal
         */
        public static registerAllEvents(eventsManager: EventsService, masterTable: IMasterTable) {
            for (var key in this._components) {
                if (this._components[key].registerEvents && typeof this._components[key].registerEvents === 'function') {
                    this._components[key].registerEvents.call(eventsManager, eventsManager, masterTable);
                }
            }
        }

        
    }
}