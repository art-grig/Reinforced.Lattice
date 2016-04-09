/// <reference path="../ExternalTypings.d.ts"/>
/// <reference path="RenderingStack.ts"/>
var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
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
            LayoutRenderer.prototype.bindEventsQueue = function (parentElement) {
                var sources = parentElement.querySelectorAll('[data-be]');
                for (var i = 0; i < sources.length; i++) {
                    var evSource = sources.item(i);
                    var bindTrack = parseInt(evSource.getAttribute('data-be'));
                    var evDescription = this._eventsQueue[bindTrack];
                    for (var j = 0; j < evDescription.Functions.length; j++) {
                        var bindFn = evDescription.Functions[j];
                        var fnItself = null;
                        if (evDescription.Target[bindFn] && (typeof evDescription.Target[bindFn] === 'function')) {
                            fnItself = evDescription[bindFn];
                        }
                        else {
                            fnItself = eval(bindFn);
                        }
                        for (var k = 0; k < evDescription.Events.length; k++) {
                            (function (r, s, fn, e) {
                                s.addEventListener(e, function (evt) { return fn.apply(r, [s, evt]); });
                            })(evDescription.Target, evSource, fnItself, evDescription.Events[k]);
                        }
                    }
                    evSource.removeAttribute('data-be');
                }
            };
            LayoutRenderer.prototype.bodyHelper = function () {
                return '<input type="hidden" data-track="tableBodyHere" style="display:none;"/>';
            };
            LayoutRenderer.prototype.pluginHelper = function (pluginPosition, pluginId) {
                var plugin = this._instances.getPlugin(pluginId, pluginPosition);
                return this.pluginHelperInner(plugin);
            };
            LayoutRenderer.prototype.pluginsHelper = function (pluginPosition) {
                var plugins = this._instances.getPlugins(pluginPosition);
                if (!plugins)
                    return '';
                var result = '';
                for (var a in plugins) {
                    if (plugins.hasOwnProperty(a)) {
                        var v = plugins[a];
                        result += this.pluginHelperInner(v);
                    }
                }
                return result;
            };
            LayoutRenderer.prototype.pluginHelperInner = function (plugin) {
                if (plugin.renderElement)
                    return plugin.renderElement(this._templatesProvider);
                if (!plugin.renderContent)
                    return '';
                this._stack.push(Rendering.RenderingContextType.Plugin, plugin);
                var result = this._templatesProvider.getCachedTemplate('pluginWrapper')(plugin);
                this._stack.popContext();
                return result;
            };
            LayoutRenderer.prototype.headerHelper = function (columnName) {
                return this.headerHelperInner(this._instances.getColumn(columnName));
            };
            LayoutRenderer.prototype.headerHelperInner = function (column) {
                this._stack.push(Rendering.RenderingContextType.Header, column.Header, column.RawName);
                var result = this._templatesProvider.getCachedTemplate('headerWrapper')(column.Header);
                this._stack.popContext();
                return result;
            };
            LayoutRenderer.prototype.headersHelper = function () {
                var columns = this._instances.getUiColumns();
                var result = '';
                for (var a in columns) {
                    if (columns.hasOwnProperty(a)) {
                        var v = columns[a];
                        result += this.headerHelperInner(v);
                    }
                }
                return result;
            };
            LayoutRenderer.prototype.bindEventHelper = function (commaSeparatedFunctions, commaSeparatedEvents) {
                var ed = {
                    Target: this._stack.Current.Object,
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
                        throw new Error("It is required to override renderContent for plugin");
                }
                return '';
            };
            return LayoutRenderer;
        })();
        Rendering.LayoutRenderer = LayoutRenderer;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
