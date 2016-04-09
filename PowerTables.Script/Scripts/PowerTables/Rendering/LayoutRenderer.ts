/// <reference path="../ExternalTypings.d.ts"/>
/// <reference path="RenderingStack.ts"/>

module PowerTables.Rendering {

    /**
     * Layout renderer
     * Is responsive for common layout rendering (with plugins, columns, etc)
     */
    export class LayoutRenderer {

        private _instances: InstanceManager;
        private _templatesProvider: ITemplatesProvider;
        private _hb: Handlebars.IHandlebars;
        private _eventsQueue: IEventDescriptor[];
        private _stack: RenderingStack;

        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances:InstanceManager) {
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


        public bindEventsQueue(parentElement: HTMLElement): void {
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

        //#region Handlebars helpers

        private bodyHelper(): string {
            return '<input type="hidden" data-track="tableBodyHere" style="display:none;"/>';
        }

        //#region Plugin helpers
        private pluginHelper(pluginPosition: string, pluginId: string): string {
            var plugin = this._instances.getPlugin(pluginId, pluginPosition);
            return this.renderPlugin(plugin);
        }

        private pluginsHelper(pluginPosition: string): string {
            var plugins = this._instances.getPlugins(pluginPosition);
            if (!plugins) return '';
            var result = '';

            for (var a in plugins) {
                if (plugins.hasOwnProperty(a)) {
                    var v = plugins[a];
                    result += this.renderPlugin(v);
                }
            }
            return result;
        }
        /**
         * Renders specified plugin into string including its wrapper
         * 
         * @param plugin Plugin interface
         * @returns {} 
         */
        public  renderPlugin(plugin: IPlugin): string {
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
            return this.headerHelperInner(this._instances.getColumn(columnName));
        }

        private headerHelperInner(column: IColumn): string {
            this._stack.push(RenderingContextType.Header, column.Header, column.RawName);
            var result = this._templatesProvider.getCachedTemplate('headerWrapper')(column.Header);
            this._stack.popContext();
            return result;
        }

        private headersHelper(): string {
            var columns = this._instances.getUiColumns();
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
        
        //#region

        private bindEventHelper(commaSeparatedFunctions: string, commaSeparatedEvents: string): string {
            var ed = <IEventDescriptor>{
                Target: this._stack.Current.Object,
                Functions: commaSeparatedFunctions.split(','),
                Events: commaSeparatedEvents.split(',')
            };
            var index = this._eventsQueue.length;
            this._eventsQueue.push(ed);
            return `data-be=${index}`;
        }

        public renderContent(columnName?: string): string {
            switch (this._stack.Current.Type) {
                case RenderingContextType.Header:
                    return (<IColumnHeader>this._stack.Current.Object).Column.Configuration.Title
                        || (<IColumnHeader>this._stack.Current.Object).Column.RawName;

                case RenderingContextType.Plugin:
                    // if we are here then plugin's renderContent is not 
                    // overriden
                    throw new Error("It is required to override renderContent for plugin");
            }
            return '';
        }

    }


    interface IEventDescriptor {
        Target: any;
        Functions: string[];
        Events: string[];
    }

} 