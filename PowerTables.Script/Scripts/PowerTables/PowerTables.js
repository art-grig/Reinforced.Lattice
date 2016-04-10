var PowerTables;
(function (PowerTables) {
    var PowerTable = (function () {
        function PowerTable(configuration) {
            this._configuration = configuration;
            this.bindReady();
        }
        PowerTable.prototype.bindReady = function () {
            var _self = this;
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", function () {
                    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                    _self.initialize();
                }, false);
            }
            else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        document.detachEvent("onreadystatechange", arguments.callee);
                        _self.initialize();
                    }
                });
                if (document.documentElement.doScroll && window == window.top)
                    (function () {
                        if (_self._isReady)
                            return;
                        try {
                            document.documentElement.doScroll("left");
                        }
                        catch (error) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        _self.initialize();
                    })();
            }
            window.addEventListener('load', function (e) {
                if (_self._isReady)
                    return;
                _self.initialize();
            });
        };
        PowerTable.prototype.initialize = function () {
            this._isReady = true;
            this.Events = new PowerTables.EventsManager(this);
            this.InstanceManager = new PowerTables.InstanceManager(this._configuration, this, this.Events);
            var isDt = this.InstanceManager.isDateTime.bind(this.InstanceManager);
            this.DataHolder = new PowerTables.DataHolder(this.InstanceManager.getColumnNames(), isDt, this.Events, this.InstanceManager);
            this.Loader = new PowerTables.Loader(this._configuration.StaticData, this._configuration.OperationalAjaxUrl, this.Events, this.DataHolder);
            this.Renderer = new PowerTables.Rendering.Renderer(this._configuration.TableRootId, this._configuration.Prefix, isDt, this.InstanceManager);
            this.Controller = new PowerTables.Controller(this);
            this.Renderer.layout();
            if (this._configuration.LoadImmediately) {
                this.Controller.reload();
            }
        };
        /**
         * Reloads table content.
         * This method is left for backward compatibility
         *
         * @returns {}
         */
        PowerTable.prototype.reload = function () {
            this.Controller.reload();
        };
        return PowerTable;
    })();
    PowerTables.PowerTable = PowerTable;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=PowerTables.js.map