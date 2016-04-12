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
            this.DataHolder = new PowerTables.DataHolder(this.InstanceManager.getColumnNames(), this.Events, this.InstanceManager);
            this.Loader = new PowerTables.Loader(this._configuration.StaticData, this._configuration.OperationalAjaxUrl, this.Events, this.DataHolder);
            this.Renderer = new PowerTables.Rendering.Renderer(this._configuration.TableRootId, this._configuration.Prefix, this.InstanceManager, this.Events);
            this.Controller = new PowerTables.Controller(this);
            this.InstanceManager.initPlugins();
            this.Renderer.layout();
            if (this._configuration.LoadImmediately) {
                this.Controller.reload();
            }
            else {
                this.Controller.showTableMessage({
                    MessageType: 'initial',
                    Message: 'No filtering specified',
                    AdditionalData: 'To retrieve query results please specify several filters'
                });
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
        /**
         * Fires specified DOM event on specified element
         *
         * @param eventName DOM event id
         * @param element Element is about to dispatch event
         */
        PowerTable.fireDomEvent = function (eventName, element) {
            if ("createEvent" in document) {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent(eventName, false, true);
                element.dispatchEvent(evt);
            }
            else
                element['fireEvent'](eventName);
        };
        return PowerTable;
    })();
    PowerTables.PowerTable = PowerTable;
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=PowerTables.js.map