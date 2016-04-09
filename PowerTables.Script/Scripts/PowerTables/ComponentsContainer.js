var PowerTables;
(function (PowerTables) {
    /**
     * Components container for registration/resolving plugins
     */
    var ComponentsContainer = (function () {
        function ComponentsContainer() {
        }
        /**
         * Registers component in components container for further instantiation
         * @param key Text ID for component
         * @param ctor Constructor function
         * @returns {}
         */
        ComponentsContainer.registerComponent = function (key, ctor) {
            this._components[key] = ctor;
        };
        /**
         * Instantiates component by its ID with specified arguments
         * @param key Text ID of desired component
         * @param args String arguments for instantiation
         * @returns {}
         */
        ComponentsContainer.resolveComponent = function (key, args) {
            if (!this._components[key])
                throw new Error("Component " + key + " is not registered. Please ensure that you have connected all the additional scripts");
            if (!args)
                return new this._components[key];
            else {
                var ctor = this._components[key];
                var boundCtor = Function.prototype.bind.apply(ctor, [null].concat(args));
                return new boundCtor();
            }
        };
        ComponentsContainer._components = {};
        return ComponentsContainer;
    })();
    PowerTables.ComponentsContainer = ComponentsContainer;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=ComponentsContainer.js.map