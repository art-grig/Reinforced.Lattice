/// <reference path="../../../PowerTables.Mvc/Scripts/typings/handlebars/handlebars.d.ts" />
/// <reference path="../ExternalTypings.d.ts"/>
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
        private _columns: { [key: string]: IColumn } = {};

        constructor(templates: ITemplatesProvider,stack:RenderingStack) {
            this._hb = templates.HandlebarsInstance;
            this._templatesProvider = templates;
            this._stack = stack;

            this._hb.registerHelper('Body', this.bodyHelper);
            this._hb.registerHelper('Plugin', this.pluginHelper.bind(this));
            this._hb.registerHelper('Plugins', this.pluginsHelper.bind(this));
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
        private getColumn(columnName: string): IColumn {
            if (!this._columns.hasOwnProperty(columnName))
                throw new Error(`Column ${columnName} not found for rendering`);
            return this._columns[columnName];
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

        // #region headers helper
        private headerHelper(columnName: string): string {
            return this.headerHelperInner(this.getColumn(columnName));
        }

        private headerHelperInner(column: IColumn): string {
            this._stack.push(RenderingContextType.Header,column.Header,column.RawName);
            var result = this._templatesProvider.getCachedTemplate('headerWrapper')(column.Header);
            this._stack.popContext();
            return result;
        }

        private headersHelper(): string {
            var columns = this._columns;
            var result = '';
            for (var a in columns) {
                if (columns.hasOwnProperty(a)) {
                    var v = columns[a];
                    result += this.headerHelperInner(v);
                }
            }
            return result;
        }
        //#endregion

        //#region filter helper
        private columFilterHelper(columnName: string): string {
            return this.columnFilterHelperInner(this.getColumn(columnName));
        }

        private columnFilterHelperInner(column: IColumn): string {
            this._stack.push(RenderingContextType.Filter, column.Filter, column.RawName);
            var result = this._templatesProvider.getCachedTemplate('filterWrapper')(column.Filter);
            this._stack.popContext();
            return result;
        }

        private columFiltersHelper(): string {
            var columns = this._columns;
            var result = '';
            for (var a in columns) {
                if (columns.hasOwnProperty(a)) {
                    var v = columns[a];
                    result += this.columnFilterHelperInner(v);
                }
            }
            return result;
        }
        //#endregion
        
        //#region
    }


    interface IEventDescriptor {
        Target: any;
        Functions: string[];
        Events: string[];
    }

} 