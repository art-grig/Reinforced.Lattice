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
        private _eventsQueue: IEventDescriptor[] = [];
        private _markQueue: IMarkDescriptor[] = [];
        private _datepickersQueue: IDatepickerDescriptor[] = [];

        private _stack: RenderingStack;

        constructor(templates: ITemplatesProvider, stack: RenderingStack, instances: InstanceManager) {
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
            this._hb.registerHelper('Mark', this.markHelper.bind(this));
            this._hb.registerHelper('Datepicker', this.datepickerHelper.bind(this));
        }

        private traverseBackbind<T>(parentElement: HTMLElement, backbindCollection: T[], attribute: string, fn: (backbind: T, element: HTMLElement) => void) {
            var elements = parentElement.querySelectorAll(`[${attribute}]`);
            for (var i = 0; i < elements.length; i++) {
                var element = <HTMLElement>elements.item(i);
                var idx = parseInt(element.getAttribute(attribute));
                var backbindDescription = backbindCollection[idx];
                fn.call(this, backbindDescription, element);
                element.removeAttribute(attribute);
            }
        }

        /**
         * Applies binding of events left in events queue
         * 
         * @param parentElement Parent element to lookup for event binding attributes
         * @returns {} 
         */
        public backBind(parentElement: HTMLElement): void {
            
            // back binding of datepickers
            this.traverseBackbind<IDatepickerDescriptor>(parentElement, this._datepickersQueue, 'data-dp', (b, e) => {
                this._instances.createDatePicker(e);
            });
            // back binding of componens needed HTML elements
            this.traverseBackbind<IMarkDescriptor>(parentElement, this._markQueue, 'data-mrk', (b, e) => {
                b.ElementReceiver[b.FieldName] = e;
            });
            
            // backbinding of events
            this.traverseBackbind<IEventDescriptor>(parentElement, this._eventsQueue, 'data-be', (subscription, domSource) => {
                for (var j = 0; j < subscription.Functions.length; j++) {
                    var bindFn = subscription.Functions[j];
                    var handler = null;
                    if (subscription.EventReceiver[bindFn] && (typeof subscription.EventReceiver[bindFn] === 'function')) {
                        handler = subscription.EventReceiver[bindFn];
                    } else {
                        handler = eval(bindFn);
                    }

                    for (var k = 0; k < subscription.Events.length; k++) {
                        (function (receiver,
                            domSource,
                            handler,
                            eventId,
                            eventArguments: any[]) {
                            domSource.addEventListener(eventId, (evt) => {
                                handler.apply(receiver, [
                                    {
                                        Element: domSource,
                                        EventObject: evt,
                                        Receiver: receiver,
                                        EventArguments: eventArguments
                                    }
                                ]);
                            });
                        })(subscription.EventReceiver,
                            domSource,
                            handler,
                            subscription.Events[k],
                            subscription.EventArguments);
                    }

                }
            });
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
        public renderPlugin(plugin: IPlugin): string {
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
            return this.renderHeader(this._instances.getColumn(columnName));
        }

        /**
         * Renders specified column's header into string including its wrapper
         * 
         * @param column Column which header is about to be rendered
         * @returns {} 
         */
        public renderHeader(column: IColumn): string {
            this._stack.push(RenderingContextType.Header, column.Header, column.RawName);
            var result;

            if (column.Header.renderElement) result = column.Header.renderElement(this._templatesProvider);
            else result = this._templatesProvider.getCachedTemplate('headerWrapper')(column.Header);

            this._stack.popContext();
            return result;
        }

        private headersHelper(): string {
            var columns = this._instances.getUiColumns();
            var result = '';
            for (var a in columns) {
                if (columns.hasOwnProperty(a)) {
                    var v = columns[a];
                    result += this.renderHeader(v);
                }
            }
            return result;
        }
        //#endregion
        
        //#region

        private bindEventHelper(): string {
            var commaSeparatedFunctions = arguments[0];
            var commaSeparatedEvents = arguments[1];
            var eventArgs = [];
            if (arguments.length > 3) {
                for (var i = 2; i <= arguments.length - 2; i++) {
                    eventArgs.push(arguments[i]);
                }
            }
            var ed = <IEventDescriptor>{
                EventReceiver: this._stack.Current.Object,
                Functions: commaSeparatedFunctions.split(','),
                Events: commaSeparatedEvents.split(','),
                EventArguments: eventArgs
            };
            var index = this._eventsQueue.length;
            this._eventsQueue.push(ed);
            return `data-be=${index}`;
        }

        private markHelper(fieldName): string {
            var index = this._markQueue.length;
            var md = <IMarkDescriptor>{
                ElementReceiver: this._stack.Current.Object,
                FieldName: fieldName
            };
            this._markQueue.push(md);
            return `data-mrk=${index}`;
        }

        private datepickerHelper(columnName: string): string {
            var index = this._datepickersQueue.length;
            if (this._instances.Columns[columnName].IsDateTime) {
                var md = <IDatepickerDescriptor>{
                    ElementReceiver: this._stack.Current.Object
                };
                this._datepickersQueue.push(md);
                return `data-dp=${index}`;
            }
            return '';
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

    interface IMarkDescriptor {
        ElementReceiver: any;
        FieldName: string;
    }

    interface IDatepickerDescriptor {
        ElementReceiver: any;
    }

    /**
     * Descriptor for event from events queue
     */
    interface IEventDescriptor {
        /**
         * Event target. 
         * Plugin, cell, header etc. Table entity that will receive event
         */
        EventReceiver: any;
        /**
         * Event handlers that will be called
         */
        Functions: string[];
        /**
         * DOM events that will trigger handler call
         */
        Events: string[];

        /**
         * Event argumetns
         */
        EventArguments: any[];
    }

    /**
     * Event that was bound from template
     */
    export interface ITemplateBoundEvent<T> {
        /**
         * Element triggered particular event
         */
        Element: HTMLElement;

        /**
         * Original DOM event
         */
        EventObject: Event;

        /**
         * Event received (to avoid using "this" in come cases)
         */
        Receiver: T;

        /**
         * Event argumetns
         */
        EventArguments: any[];
    }
} 