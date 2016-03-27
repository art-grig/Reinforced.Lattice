/// <reference path="../../PowerTables.Mvc/Scripts/typings/handlebars/handlebars.d.ts" />
/// <reference path="RenderingStack.ts"/>

module PowerTables.Rendering {

    /**
     * Layout renderer
     * Is responsive for common layout rendering (with plugins, columns, etc)
     */
    export class LayoutRenderer {
        private _templatesProvider: ITemplatesProvider;
        private _hb: Handlebars.IHandlebars;
        private _eventsQueue: IEventDescriptor[];
        private _stack: RenderingStack;
        private _plugins: { [key: string]: { [key: string]: IPlugin } } = {};
        private _toolbarPlugins: { [key: string]: { [key: string]: IPlugin } } = {};

        constructor(templates: ITemplatesProvider) {
            this._hb = templates.HandlebarsInstance;
            this._templatesProvider = templates;
            this._stack = new RenderingStack();

            this._hb.registerHelper('Body', this.bodyHelper);
            this._hb.registerHelper('Plugin', this.pluginHelper.bind(this));
            this._hb.registerHelper('Plugins', this.pluginsHelper.bind(this));
            this._hb.registerHelper('ToolbarPlugin', this.toolbarPluginHelper.bind(this));
            this._hb.registerHelper('ToolbarPlugins', this.toolbarPluginsHelper.bind(this));
            this._hb.registerHelper('Header', this.headerHelper.bind(this));
            this._hb.registerHelper('Headers', this.headersHelper.bind(this));
            this._hb.registerHelper('ColumnFilter', this.columFilterHelper.bind(this));
            this._hb.registerHelper('ColumnFilters', this.columFiltersHelper.bind(this));
        }


        private bindEventsQueue(parentElement: HTMLElement): void {
            // bind plugins/filters events
            var sources = parentElement.querySelectorAll('[data-be]');
            for (var i = 0; i < sources.length; i++) {
                var evSource = <HTMLElement>sources.item(i);
                var bindTrack = parseInt(evSource.getAttribute('data-be'));

                var evDescription = this._eventsQueue[bindTrack];

                for (var j = 0; j < evDescription.Functions.length; j++) {
                    var bindFn = evDescription.Functions[j];
                    var fnItself = null;
                    if (evDescription.Target[bindFn] && (typeof evDescription.Target[bindFn] === 'function')) {
                        fnItself = evDescription[bindFn];
                    } else {
                        fnItself = eval(bindFn);
                    }

                    for (var k = 0; k < evDescription.Events.length; k++) {
                        (function (r, s, fn, e) {
                            s.addEventListener(e, (evt) => fn.apply(r, [s, evt]));
                        })(evDescription.Target, evSource, fnItself, evDescription.Events[k]);
                    }

                }
                evSource.removeAttribute('data-be');
            }
        }

        //#region Useful getter shortcuts
        private getPlugin(position: string, id: string) {
            if (!this._plugins.hasOwnProperty(position))
                throw new Error(`Table does not have plugins on position ${position}`);
            var p = this._plugins[position];
            if (!p.hasOwnProperty(id))
                throw new Error(`Table does not have plugin ${id} on position ${position}`);
            return p[id];
        }

        private getToolbarPlugin(position: string, id: string) {
            if (!this._toolbarPlugins.hasOwnProperty(position))
                throw new Error(`Table does not have toolbar plugins on position ${position}`);
            var p = this._toolbarPlugins[position];
            if (!p.hasOwnProperty(id))
                throw new Error(`Table does not have toolbar plugin ${id} on position ${position}`);
            return p[id];
        }
        //#endregion

        //#region Handlebars helpers

        private bodyHelper(): string {
            return '<input type="hidden" data-track="tableBodyHere" style="display:none;"/>';
        }

        //#region Plugin helpers
        private pluginHelper(pluginPosition: string, pluginId: string): string {
            var plugin = this.getPlugin(pluginPosition, pluginId);
            return this.pluginHelperInner(plugin);
        }

        private pluginsHelper(pluginPosition: string): string {
            var plugins = this._plugins[pluginPosition];
            if (!plugins) return '';
            var result = '';

            for (var a in plugins) {
                if (plugins.hasOwnProperty(a)) {
                    var v = plugins[a];
                    result += this.pluginHelperInner(v);
                }
            }
            return result;
        }

        private pluginHelperInner(plugin: IPlugin): string {
            if (plugin.renderElement) return plugin.renderElement(this._templatesProvider);
            if (!plugin.renderContent) return '';
            this._stack.push(RenderingContextType.Plugin, plugin);
            var result = this._templatesProvider.getCachedTemplate('pluginWrapper')(plugin);
            this._stack.popContext();
            return result;
        }
        //#endregion

        //#region Toolbar plugins helpers
        //#endregion
        private toolbarPluginHelper(pluginPosition: string, pluginId: string): string {
            var plugin = this.getToolbarPlugin(pluginPosition, pluginId);
            return this.toolbarPluginHelperInner(plugin);;
        }

        private toolbarPluginsHelper(pluginPosition: string): string {
            var plugins = this._toolbarPlugins[pluginPosition];
            if (!plugins) return '';
            var result = '';

            for (var a in plugins) {
                if (plugins.hasOwnProperty(a)) {
                    var v = plugins[a];
                    result += this.toolbarPluginHelperInner(v);
                }
            }
            return result;
        }

        private toolbarPluginHelperInner(plugin: IPlugin): string {
            if (plugin.renderElement) return plugin.renderElement(this._templatesProvider);
            if (!plugin.renderContent) return plugin.renderContent(this._templatesProvider);
            this._stack.push(RenderingContextType.Plugin, plugin);
            var result = plugin.renderContent(this._templatesProvider);
            this._stack.popContext();
            return result;
        }
        //#region
    }


    interface IEventDescriptor {
        Target: any;
        Functions: string[];
        Events: string[];
    }

} 