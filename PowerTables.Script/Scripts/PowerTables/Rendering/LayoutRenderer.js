/// <reference path="../ExternalTypings.d.ts"/>
/// <reference path="RenderingStack.ts"/>
var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        /**
         * Layout renderer
         * Is responsive for common layout rendering (with plugins, columns, etc)
         */
        var LayoutRenderer = (function () {
            function LayoutRenderer(templates, stack, instances) {
                this._hb = templates.HandlebarsInstance;
                this._templatesProvider = templates;
                this._stack = stack;
                this._instances = instances;
                this._hb.registerHelper('Body', this.bodyHelper);
                this._hb.registerHelper('Plugin', this.pluginHelper.bind(this));
                this._hb.registerHelper('Plugins', this.pluginsHelper.bind(this));
                this._hb.registerHelper('Header', this.headerHelper.bind(this));
                this._hb.registerHelper('Headers', this.headersHelper.bind(this));
                this._hb.registerHelper('BindEvent', this.bindEventHelper.bind(this));
            }
            /**
             * Applies binding of events left in events queue
             *
             * @param parentElement Parent element to lookup for event binding attributes
             * @returns {}
             */
            LayoutRenderer.prototype.bindEventsQueue = function (parentElement) {
                // bind plugins/filters events
                var sources = parentElement.querySelectorAll('[data-be]');
                for (var i = 0; i < sources.length; i++) {
                    var domSource = sources.item(i);
                    var bindTrack = parseInt(domSource.getAttribute('data-be'));
                    var subscription = this._eventsQueue[bindTrack];
                    for (var j = 0; j < subscription.Functions.length; j++) {
                        var bindFn = subscription.Functions[j];
                        var handler = null;
                        if (subscription.EventReceiver[bindFn] && (typeof subscription.EventReceiver[bindFn] === 'function')) {
                            handler = subscription[bindFn];
                        }
                        else {
                            handler = eval(bindFn);
                        }
                        for (var k = 0; k < subscription.Events.length; k++) {
                            (function (evtTarget, evtSource, fn, e) {
                                evtSource.addEventListener(e, function (evt) { return fn.apply(evtTarget, [evtSource, evt]); });
                            })(subscription.EventReceiver, domSource, handler, subscription.Events[k]);
                        }
                    }
                    domSource.removeAttribute('data-be');
                }
            };
            //#region Handlebars helpers
            LayoutRenderer.prototype.bodyHelper = function () {
                return '<input type="hidden" data-track="tableBodyHere" style="display:none;"/>';
            };
            //#region Plugin helpers
            LayoutRenderer.prototype.pluginHelper = function (pluginPosition, pluginId) {
                var plugin = this._instances.getPlugin(pluginId, pluginPosition);
                return this.renderPlugin(plugin);
            };
            LayoutRenderer.prototype.pluginsHelper = function (pluginPosition) {
                var plugins = this._instances.getPlugins(pluginPosition);
                if (!plugins)
                    return '';
                var result = '';
                for (var a in plugins) {
                    if (plugins.hasOwnProperty(a)) {
                        var v = plugins[a];
                        result += this.renderPlugin(v);
                    }
                }
                return result;
            };
            /**
             * Renders specified plugin into string including its wrapper
             *
             * @param plugin Plugin interface
             * @returns {}
             */
            LayoutRenderer.prototype.renderPlugin = function (plugin) {
                if (plugin.renderElement)
                    return plugin.renderElement(this._templatesProvider);
                if (!plugin.renderContent)
                    return '';
                this._stack.push(Rendering.RenderingContextType.Plugin, plugin);
                var result = this._templatesProvider.getCachedTemplate('pluginWrapper')(plugin);
                this._stack.popContext();
                return result;
            };
            //#endregion
            // #region headers helper
            LayoutRenderer.prototype.headerHelper = function (columnName) {
                return this.renderHeader(this._instances.getColumn(columnName));
            };
            /**
             * Renders specified column's header into string including its wrapper
             *
             * @param column Column which header is about to be rendered
             * @returns {}
             */
            LayoutRenderer.prototype.renderHeader = function (column) {
                this._stack.push(Rendering.RenderingContextType.Header, column.Header, column.RawName);
                var result;
                if (column.Header.renderElement)
                    result = column.Header.renderElement(this._templatesProvider);
                else
                    result = this._templatesProvider.getCachedTemplate('headerWrapper')(column.Header);
                this._stack.popContext();
                return result;
            };
            LayoutRenderer.prototype.headersHelper = function () {
                var columns = this._instances.getUiColumns();
                var result = '';
                for (var a in columns) {
                    if (columns.hasOwnProperty(a)) {
                        var v = columns[a];
                        result += this.renderHeader(v);
                    }
                }
                return result;
            };
            //#endregion
            //#region
            LayoutRenderer.prototype.bindEventHelper = function (commaSeparatedFunctions, commaSeparatedEvents) {
                var ed = {
                    EventReceiver: this._stack.Current.Object,
                    Functions: commaSeparatedFunctions.split(','),
                    Events: commaSeparatedEvents.split(',')
                };
                var index = this._eventsQueue.length;
                this._eventsQueue.push(ed);
                return "data-be=" + index;
            };
            LayoutRenderer.prototype.renderContent = function (columnName) {
                switch (this._stack.Current.Type) {
                    case Rendering.RenderingContextType.Header:
                        return this._stack.Current.Object.Column.Configuration.Title
                            || this._stack.Current.Object.Column.RawName;
                    case Rendering.RenderingContextType.Plugin:
                        // if we are here then plugin's renderContent is not 
                        // overriden
                        throw new Error("It is required to override renderContent for plugin");
                }
                return '';
            };
            return LayoutRenderer;
        })();
        Rendering.LayoutRenderer = LayoutRenderer;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=LayoutRenderer.js.map