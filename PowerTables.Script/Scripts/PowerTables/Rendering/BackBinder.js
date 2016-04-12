var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        var BackBinder = (function () {
            function BackBinder(hb, instances, stack) {
                this._eventsQueue = [];
                this._markQueue = [];
                this._datepickersQueue = [];
                this._instances = instances;
                hb.registerHelper('BindEvent', this.bindEventHelper.bind(this));
                hb.registerHelper('Mark', this.markHelper.bind(this));
                hb.registerHelper('Datepicker', this.datepickerHelper.bind(this));
                this._stack = stack;
            }
            BackBinder.prototype.traverseBackbind = function (parentElement, backbindCollection, attribute, fn) {
                var elements = parentElement.querySelectorAll("[" + attribute + "]");
                for (var i = 0; i < elements.length; i++) {
                    var element = elements.item(i);
                    var idx = parseInt(element.getAttribute(attribute));
                    var backbindDescription = backbindCollection[idx];
                    fn.call(this, backbindDescription, element);
                    element.removeAttribute(attribute);
                }
            };
            /**
             * Applies binding of events left in events queue
             *
             * @param parentElement Parent element to lookup for event binding attributes
             * @returns {}
             */
            BackBinder.prototype.backBind = function (parentElement) {
                var _this = this;
                // back binding of datepickers
                this.traverseBackbind(parentElement, this._datepickersQueue, 'data-dp', function (b, e) {
                    _this._instances.createDatePicker(e);
                });
                // back binding of componens needed HTML elements
                this.traverseBackbind(parentElement, this._markQueue, 'data-mrk', function (b, e) {
                    if (Object.prototype.toString.call(b.ElementReceiver[b.FieldName]) === '[object Array]') {
                        b.ElementReceiver[b.FieldName].push(e);
                    }
                    else {
                        b.ElementReceiver[b.FieldName] = e;
                    }
                });
                // backbinding of events
                this.traverseBackbind(parentElement, this._eventsQueue, 'data-be', function (subscription, domSource) {
                    for (var j = 0; j < subscription.Functions.length; j++) {
                        var bindFn = subscription.Functions[j];
                        var handler = null;
                        if (subscription.EventReceiver[bindFn] && (typeof subscription.EventReceiver[bindFn] === 'function')) {
                            handler = subscription.EventReceiver[bindFn];
                        }
                        else {
                            handler = eval(bindFn);
                        }
                        for (var k = 0; k < subscription.Events.length; k++) {
                            (function (receiver, domSource, handler, eventId, eventArguments) {
                                domSource.addEventListener(eventId, function (evt) {
                                    handler.apply(receiver, [
                                        {
                                            Element: domSource,
                                            EventObject: evt,
                                            Receiver: receiver,
                                            EventArguments: eventArguments
                                        }
                                    ]);
                                });
                            })(subscription.EventReceiver, domSource, handler, subscription.Events[k], subscription.EventArguments);
                        }
                    }
                });
                this._markQueue = [];
                this._eventsQueue = [];
                this._datepickersQueue = [];
            };
            BackBinder.prototype.bindEventHelper = function () {
                var commaSeparatedFunctions = arguments[0];
                var commaSeparatedEvents = arguments[1];
                var eventArgs = [];
                if (arguments.length > 3) {
                    for (var i = 2; i <= arguments.length - 2; i++) {
                        eventArgs.push(arguments[i]);
                    }
                }
                var ed = {
                    EventReceiver: this._stack.Current.Object,
                    Functions: commaSeparatedFunctions.split(','),
                    Events: commaSeparatedEvents.split(','),
                    EventArguments: eventArgs
                };
                var index = this._eventsQueue.length;
                this._eventsQueue.push(ed);
                return "data-be=\"" + index + "\"";
            };
            BackBinder.prototype.markHelper = function (fieldName) {
                var index = this._markQueue.length;
                var md = {
                    ElementReceiver: this._stack.Current.Object,
                    FieldName: fieldName
                };
                this._markQueue.push(md);
                return "data-mrk=\"" + index + "\"";
            };
            BackBinder.prototype.datepickerHelper = function (columnName) {
                var index = this._datepickersQueue.length;
                if (this._instances.Columns[columnName].IsDateTime) {
                    var md = {
                        ElementReceiver: this._stack.Current.Object
                    };
                    this._datepickersQueue.push(md);
                    return "data-dp=\"" + index + "\"";
                }
                return '';
            };
            return BackBinder;
        })();
        Rendering.BackBinder = BackBinder;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=BackBinder.js.map