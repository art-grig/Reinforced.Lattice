
module PowerTables {
    /**
     * Main entry point for all tables functionality
     */
    export class PowerTable implements IMasterTable {
        /**
         * Constructs new instance of PowerTable object. 
         * Usually this method is being called automatically by .InitializationCode or .InitializationScript method, 
         * but you also could combine call of Configurator<>.JsonConfig and call of Lattice constructor
         * 
         * @param configuration JSON configuration of whole table
         */
        constructor(configuration: Configuration.Json.ITableConfiguration) {
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

        private _configuration: Configuration.Json.ITableConfiguration;

        private initialize() {
            this._isReady = true;

            if (!window['__latticeInstances']) window['__latticeInstances'] = {};
            window['__latticeInstances'][this._configuration.TableRootId] = this;

            this.Date = new PowerTables.Services.DateService(this._configuration.DatepickerOptions);
            this.Events = new PowerTables.Services.EventsService(this);
            this.InstanceManager = new PowerTables.Services.InstanceManagerService(this._configuration, this, this.Events);
            this.DataHolder = new PowerTables.Services.DataHolderService(this);
            this.Loader = new PowerTables.Services.LoaderService(this._configuration.StaticData, this._configuration.OperationalAjaxUrl, this);
            this.Renderer = new Rendering.Renderer(this._configuration.TableRootId, this._configuration.Prefix, this);
            this.Controller = new PowerTables.Services.Controller(this);
            this.Selection = new PowerTables.Services.SelectionService(this);

            this.MessageService = new PowerTables.Services.MessagesService(this._configuration.MessageFunction, this.InstanceManager, this.DataHolder, this.Controller, this.Renderer);

            this.InstanceManager.initPlugins();
            this.Renderer.layout();
            if (this._configuration.CallbackFunction) {
                this._configuration.CallbackFunction(this);
            }
            this.InstanceManager._subscribeConfiguredEvents();
            if (this._configuration.PrefetchedData != null && this._configuration.PrefetchedData.length > 0) {
                this.Loader.prefetchData(this._configuration.PrefetchedData);
                this.Controller.redrawVisibleData();
            } else {
                if (this._configuration.LoadImmediately) {
                    this.Controller.reload();
                } else {
                    this.MessageService.showMessage({
                        Class: 'initial',
                        Title: 'No filtering specified',
                        Details: 'To retrieve query results please specify several filters',
                        Type: MessageType.Banner
                    });
                }
            }
        }

        /**
         * API for working with dates
         */
        Date: PowerTables.Services.DateService;

        /**
         * Reloads table content. 
         * This method is left for backward compatibility
         * 
         * @returns {} 
         */
        public reload(force: boolean): void {
            this.Controller.reload(force);
        }

        /**
         * API for raising and handling various table events
         */
        public Events: PowerTables.Services.EventsService;

        /**
         * API for managing local data
         */
        public DataHolder: PowerTables.Services.DataHolderService;

        /**
         * API for data loading
         */
        public Loader: PowerTables.Services.LoaderService;

        /**
         * API for rendering functionality
         */
        public Renderer: Rendering.Renderer;

        /**
         * API for locating instances of different components
         */
        public InstanceManager: PowerTables.Services.InstanceManagerService;

        /**
         * API for overall workflow controlling
         */
        public Controller: PowerTables.Services.Controller;

        /**
         * API for table messages
         */
        public MessageService: PowerTables.Services.MessagesService;

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

        public proceedAdjustments(adjustments: PowerTables.Editing.IAdjustmentData): void {
            var result = this.DataHolder.proceedAdjustments(adjustments);
            if (result != null) this.Controller.drawAdjustmentResult(result);
        }

        public getStaticData(): any {
            if (!this._configuration.StaticData) return null;
            return JSON.parse(this._configuration.StaticData);
        }

        public setStaticData(obj: any): void {
            this._configuration.StaticData = JSON.stringify(obj);
        }

        Selection: PowerTables.Services.SelectionService;
    }
} 