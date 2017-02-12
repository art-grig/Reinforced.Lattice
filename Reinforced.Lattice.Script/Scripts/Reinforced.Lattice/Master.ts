
module Reinforced.Lattice {
    /**
     * Main entry point for all tables functionality
     */
    export class Master implements IMasterTable {
        /**
         * Constructs new instance of Reinforced.Lattice master object. 
         * Usually this method is being called automatically by .InitializationCode or .InitializationScript method, 
         * but you also could combine call of Configurator<>.JsonConfig and call of Lattice constructor
         * 
         * @param configuration JSON configuration of whole table
         */
        constructor(configuration: ITableConfiguration) {
            this.Configuration = configuration;
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

        private initialize() {
            this._isReady = true;

            if (!window['__latticeInstances']) window['__latticeInstances'] = {};
            window['__latticeInstances'][this.Configuration.TableRootId] = this;

            this.Stats = new Reinforced.Lattice.Services.StatsService(this);
            this.Date = new Reinforced.Lattice.Services.DateService(this.Configuration.DatepickerOptions);
            this.Events = new Reinforced.Lattice.Services.EventsService(this);
            this.InstanceManager = new Reinforced.Lattice.Services.InstanceManagerService(this.Configuration, this, this.Events);
            this.DataHolder = new Reinforced.Lattice.Services.DataHolderService(this);
            this.Loader = new Reinforced.Lattice.Services.LoaderService(this.Configuration.StaticData, this.Configuration.OperationalAjaxUrl, this);
            this.Renderer = new Rendering.Renderer(this.Configuration.TableRootId, this.Configuration.Prefix, this);
            this.Controller = new Reinforced.Lattice.Services.Controller(this);
            this.Selection = new Reinforced.Lattice.Services.SelectionService(this);
            this.Commands = new Reinforced.Lattice.Services.CommandsService(this);
            switch (this.Configuration.Partition.Type) {
                case Reinforced.Lattice.PartitionType.Client:
                    this.Partition = new Reinforced.Lattice.Services.Partition.ClientPartitionService(this);  
                    break;
                case Reinforced.Lattice.PartitionType.Server:
                    this.Partition = new Reinforced.Lattice.Services.Partition.ServerPartitionService(this);  
                    break;
                case Reinforced.Lattice.PartitionType.Sequential:
                    this.Partition = new Reinforced.Lattice.Services.Partition.SequentialPartitionService(this);
                    break;
            }
            

            this.MessageService = new Reinforced.Lattice.Services.MessagesService(this.Configuration.MessageFunction, this.InstanceManager, this.Controller, this.Renderer);
            this.InstanceManager.initPlugins();
            this.Renderer.layout();
            if (this.Configuration.CallbackFunction) {
                this.Configuration.CallbackFunction(this);
            }
            this.InstanceManager._subscribeConfiguredEvents();
            this.Partition.initial(this.Configuration.Partition
                .InitialSkip,
                this.Configuration.Partition.InitialTake);

            if (this.Configuration.PrefetchedData != null && this.Configuration.PrefetchedData.length > 0) {
                this.Loader.prefetchData(this.Configuration.PrefetchedData);
                this.Controller.redrawVisibleData();
            } else {
                if (this.Configuration.LoadImmediately) {
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
        Date: Reinforced.Lattice.Services.DateService;

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
        public Events: Reinforced.Lattice.Services.EventsService;

        /**
         * API for managing local data
         */
        public DataHolder: Reinforced.Lattice.Services.DataHolderService;

        /**
         * API for data loading
         */
        public Loader: Reinforced.Lattice.Services.LoaderService;

        /**
         * API for rendering functionality
         */
        public Renderer: Rendering.Renderer;

        /**
         * API for locating instances of different components
         */
        public InstanceManager: Reinforced.Lattice.Services.InstanceManagerService;

        /**
         * API for overall workflow controlling
         */
        public Controller: Reinforced.Lattice.Services.Controller;

        /**
         * API for table messages
         */
        public MessageService: Reinforced.Lattice.Services.MessagesService;

        /**
         * API for table messages
         */
        public Commands: Reinforced.Lattice.Services.CommandsService;

        public Partition: Reinforced.Lattice.Services.Partition.IPartitionService;

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
        public proceedAdjustments(adjustments: Reinforced.Lattice.ITableAdjustment): void {
            var result = this.DataHolder.proceedAdjustments(adjustments);
            if (result != null) this.Controller.drawAdjustmentResult(result);
        }

        public getStaticData(): any {
            if (!this.Configuration.StaticData) return null;
            return JSON.parse(this.Configuration.StaticData);
        }

        public setStaticData(obj: any): void {
            this.Configuration.StaticData = JSON.stringify(obj);
        }

        Selection: Reinforced.Lattice.Services.SelectionService;
        public Configuration: ITableConfiguration;
        public Stats: IStatsModel;
    }
} 