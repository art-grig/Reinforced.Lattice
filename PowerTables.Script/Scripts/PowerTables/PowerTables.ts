
module PowerTables {
    import TableConfiguration = Configuration.Json.ITableConfiguration;
    import AdjustmentData = PowerTables.Editors.IAdjustmentData; /**
     * Main entry point for all tables functionality
     */
    export class PowerTable implements IMasterTable {
        constructor(configuration: TableConfiguration) {
            this._configuration = configuration;
            this.bindReady();
        }
        private _isReady: boolean;
        private bindReady() {
            var _self = this;
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', function () {
                    document.removeEventListener('DOMContentLoaded', <any>arguments.callee, false);
                    _self.initialize();
                }, false);
            } else if ((<any>document).attachEvent) {
                (<any>document).attachEvent('onreadystatechange', function () {
                    if (document.readyState === 'complete') {
                        (<any>document).detachEvent('onreadystatechange', arguments.callee);
                        _self.initialize();
                    }
                });
                if ((<any>document.documentElement).doScroll && window == window.top) (function () {
                    if (_self._isReady) return;
                    try {
                        (<any>document.documentElement).doScroll('left');
                    } catch (error) {
                        setTimeout(arguments.callee, 0);
                        return;
                    }
                    _self.initialize();
                })();
            }
            window.addEventListener('load', e => {
                if (_self._isReady) return;
                _self.initialize();
            });
        }

        private _configuration: TableConfiguration;

        private initialize() {
            this._isReady = true;

            if (!window['__latticeInstances']) window['__latticeInstances'] = {};
            window['__latticeInstances'][this._configuration.TableRootId] = this;

            this.Date = new DateService(this._configuration.DatepickerOptions);
            this.Events = new EventsManager(this);
            this.InstanceManager = new InstanceManager(this._configuration, this, this.Events);
            this.DataHolder = new DataHolder(this);
            this.Loader = new Loader(this._configuration.StaticData, this._configuration.OperationalAjaxUrl, this.Events, this.DataHolder);
            this.Renderer = new Rendering.Renderer(this._configuration.TableRootId, this._configuration.Prefix, this.InstanceManager, this.Events, this.Date, this._configuration.CoreTemplates);
            this.Controller = new Controller(this);

            this.InstanceManager.initPlugins();
            this.Renderer.layout();
            if (this._configuration.LoadImmediately) {
                this.Controller.reload();
            } else {
                this.Controller.showTableMessage({
                    MessageType: 'initial',
                    Message: 'No filtering specified',
                    AdditionalData: 'To retrieve query results please specify several filters'
                });
            }
        }

        /**
         * API for working with dates
         */
        Date: DateService;

        /**
         * Reloads table content. 
         * This method is left for backward compatibility
         * 
         * @returns {} 
         */
        public reload(): void {
            this.Controller.reload();
        }

        /**
         * API for raising and handling various table events
         */
        public Events: EventsManager;

        /**
         * API for managing local data
         */
        public DataHolder: DataHolder;

        /**
         * API for data loading
         */
        public Loader: Loader;

        /**
         * API for rendering functionality
         */
        public Renderer: Rendering.Renderer;

        /**
         * API for locating instances of different components
         */
        public InstanceManager: InstanceManager;

        /**
         * API for overall workflow controlling
         */
        public Controller: Controller;

        /**
         * Fires specified DOM event on specified element
         * 
         * @param eventName DOM event id
         * @param element Element is about to dispatch event
         */
        public static fireDomEvent(eventName: string, element: HTMLElement): void {
            if ('createEvent' in document) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent(eventName, false, true);
                element.dispatchEvent(evt);
            }
            else
                element['fireEvent'](eventName);
        }

        public proceedAdjustments(adjustments: AdjustmentData):void {
            var result = this.DataHolder.proceedAdjustments(adjustments);
            this.Controller.drawAdjustmentResult(result);
        }


    }
} 