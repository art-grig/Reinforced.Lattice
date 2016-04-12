module PowerTables.Rendering {
    export class BackBinder {
        private _eventsQueue: IEventDescriptor[] = [];
        private _markQueue: IMarkDescriptor[] = [];
        private _datepickersQueue: IDatepickerDescriptor[] = [];
        private _instances: InstanceManager;
        private _stack: RenderingStack;

        constructor(hb: Handlebars.IHandlebars, instances: InstanceManager, stack: RenderingStack) {
            this._instances = instances;
            hb.registerHelper('BindEvent', this.bindEventHelper.bind(this));
            hb.registerHelper('Mark', this.markHelper.bind(this));
            hb.registerHelper('Datepicker', this.datepickerHelper.bind(this));
            this._stack = stack;
        }

        private traverseBackbind<T>(parentElement: HTMLElement, backbindCollection: T[], attribute: string, fn: (backbind: T, element: HTMLElement) => void) {
            var elements: NodeList = parentElement.querySelectorAll(`[${attribute}]`);
            for (var i: number = 0; i < elements.length; i++) {
                var element: HTMLElement = <HTMLElement>elements.item(i);
                var idx: number = parseInt(element.getAttribute(attribute));
                var backbindDescription: T = backbindCollection[idx];
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
                if (Object.prototype.toString.call(b.ElementReceiver[b.FieldName]) === '[object Array]') {
                    b.ElementReceiver[b.FieldName].push(e);
                } else if (b.Key != null && b.Key != undefined) {
                    if (typeof b.ElementReceiver[b.FieldName] === 'object') {
                        b.ElementReceiver[b.FieldName][b.Key] = e;
                    }
                } else {
                    b.ElementReceiver[b.FieldName] = e;
                }
            });

            // backbinding of events
            this.traverseBackbind<IEventDescriptor>(parentElement, this._eventsQueue, 'data-be', (subscription, domSource) => {
                for (var j: number = 0; j < subscription.Functions.length; j++) {
                    var bindFn: string = subscription.Functions[j];
                    var handler: void | Object = null;
                    if (subscription.EventReceiver[bindFn] && (typeof subscription.EventReceiver[bindFn] === 'function')) {
                        handler = subscription.EventReceiver[bindFn];
                    } else {
                        handler = eval(bindFn);
                    }

                    for (var k: number = 0; k < subscription.Events.length; k++) {
                        (function(receiver: any,
                            domSource: any,
                            handler: any,
                            eventId: any,
                            eventArguments: any[]) {
                            domSource.addEventListener(eventId, (evt: any) => {
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
            this._markQueue = [];
            this._eventsQueue = [];
            this._datepickersQueue = [];
        }

        private bindEventHelper(): string {
            var commaSeparatedFunctions = arguments[0];
            var commaSeparatedEvents = arguments[1];
            var eventArgs: any[] = [];
            if (arguments.length > 3) {
                for (var i: number = 2; i <= arguments.length - 2; i++) {
                    eventArgs.push(arguments[i]);
                }
            }
            var ed: IEventDescriptor = <IEventDescriptor>{
                EventReceiver: this._stack.Current.Object,
                Functions: commaSeparatedFunctions.split(','),
                Events: commaSeparatedEvents.split(','),
                EventArguments: eventArgs
            };
            var index: number = this._eventsQueue.length;
            this._eventsQueue.push(ed);
            return `data-be="${index}"`;
        }

        private markHelper(fieldName: any, key: any): string {
            var index: number = this._markQueue.length;
            var md: IMarkDescriptor = <IMarkDescriptor>{
                ElementReceiver: this._stack.Current.Object,
                FieldName: fieldName,
                Key: key
            };
            this._markQueue.push(md);
            return `data-mrk="${index}"`;
        }

        private datepickerHelper(columnName: string): string {
            var index: number = this._datepickersQueue.length;
            if (this._instances.Columns[columnName].IsDateTime) {
                var md: IDatepickerDescriptor = <IDatepickerDescriptor>{
                    ElementReceiver: this._stack.Current.Object
                };
                this._datepickersQueue.push(md);
                return `data-dp="${index}"`;
            }
            return '';
        }
    }

    interface IMarkDescriptor {
        ElementReceiver: any;
        FieldName: string;
        Key: any;
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
}