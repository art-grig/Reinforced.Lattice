module PowerTables {
    export class ComponentsContainer {
        private static _components: { [key: string]: any } = {};

        public static registerComponent(key: string, ctor: Function): void {
            this._components[key] = ctor;
        }

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