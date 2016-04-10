
module PowerTables {
    import TableConfiguration = PowerTables.Configuration.Json.ITableConfiguration; /**
     * Main entry point for all tables functionality
     */
    export class PowerTable implements IMasterTable {
        constructor(configuration: TableConfiguration) {
            this._configuration = configuration;
            this.bindReady();
        }
        private _isReady;
        private bindReady() {
            var _self = this;
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", function () {
                    document.removeEventListener("DOMContentLoaded", <any>arguments.callee, false);
                    _self.initialize();
                }, false);
            } else if ((<any>document).attachEvent) {
                (<any>document).attachEvent("onreadystatechange", function () {
                    if (document.readyState === "complete") {
                        (<any>document).detachEvent("onreadystatechange", arguments.callee);
                        _self.initialize();
                    }
                });
                if ((<any>document.documentElement).doScroll && window == window.top) (function () {
                    if (_self._isReady) return;
                    try {
                        (<any>document.documentElement).doScroll("left");
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
            this.Events = new EventsManager(this);
            this.InstanceManager = new InstanceManager(this._configuration, this, this.Events);
            var isDt = this.InstanceManager.isDateTime.bind(this.InstanceManager);

            this.DataHolder = new DataHolder(this.InstanceManager.getColumnNames(), isDt, this.Events, this.InstanceManager);
            this.Loader = new Loader(this._configuration.StaticData, this._configuration.OperationalAjaxUrl, this.Events, this.DataHolder);
            this.Renderer = new Rendering.Renderer(this._configuration.TableRootId, this._configuration.Prefix, isDt, this.InstanceManager, this.Events);
            this.Controller = new Controller(this);
            this.InstanceManager.initPlugins();
            this.Renderer.layout();
            if (this._configuration.LoadImmediately) {
                this.Controller.reload();
            }
        }

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

    }
} 