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
            if (!args) return new this._components[key];
            else {
                var ctor = this._components[key];
                var boundCtor = Function.prototype.bind.apply(ctor,[null].concat(args));
                return new boundCtor();
            }
        }
    }
} 