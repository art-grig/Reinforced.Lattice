var PowerTables;
(function (PowerTables) {
    var ComponentsContainer = (function () {
        function ComponentsContainer() {
        }
        ComponentsContainer.registerComponent = function (key, ctor) {
            this._components[key] = ctor;
        };
        ComponentsContainer.resolveComponent = function (key, args) {
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