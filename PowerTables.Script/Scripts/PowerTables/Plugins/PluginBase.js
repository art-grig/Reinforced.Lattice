var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        /**
         * Base class for plugins.
         * It contains necessary infrastructure for convinence of plugins creation
         */
        var PluginBase = (function () {
            function PluginBase() {
            }
            PluginBase.prototype.init = function (masterTable, configuration) {
                if (configuration)
                    this.Configuration = configuration.Configuration;
                this.MasterTable = masterTable;
                this.subscribe(masterTable.Events);
                this.registerAdditionalHelpers(masterTable.Renderer.HandlebarsInstance);
            };
            /**
             * Events subscription method.
             * In derived class here should be subscription to various events
             *
             * @param e Events manager
             */
            PluginBase.prototype.subscribe = function (e) { };
            /**
             * In this method you can register any additional Handlebars.js helpers in case of your
             * templates needs ones
             *
             * @param hb Handlebars instance
             * @returns {}
             */
            PluginBase.prototype.registerAdditionalHelpers = function (hb) { };
            return PluginBase;
        })();
        Plugins.PluginBase = PluginBase;
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=PluginBase.js.map