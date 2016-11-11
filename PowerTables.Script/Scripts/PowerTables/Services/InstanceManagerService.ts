module PowerTables.Services {
    /**
    * This thing is used to manage instances of columns, plugins etc. 
    * It consumes PT configuration as source and provides caller with 
    * plugins instances, variable ways to query them and accessing their properties
    */
    export class InstanceManagerService {

        /*
         * @internal
         */
        constructor(configuration: Configuration.Json.ITableConfiguration, masterTable: IMasterTable, events:
            PowerTables.Services.
            EventsService) {
            this.Configuration = configuration;
            this._masterTable = masterTable;
            this._events = events;
            this._isHandlingSpecialPlacementCase = !(!this.Configuration.EmptyFiltersPlaceholder);
            this._specialCasePlaceholder = this.Configuration.EmptyFiltersPlaceholder;
            this.initColumns();
        }

        /**
         * Dictionary containing current table columns configurations.
         * Key - raw column name. Value - IColumn instance
         */
        public Columns: { [key: string]: IColumn } = {};

        /**
         * Dictionary containing all instances of table plugins. 
         * Key - full plugin ID (incl. placement). Value - plugin itself
         */
        public Plugins: { [key: string]: IPlugin } = {};

        /**
         * Events manager
         */
        private _events: PowerTables.Services.EventsService;

        /**
         * Table configuration
         */
        public Configuration: Configuration.Json.ITableConfiguration;

        private _rawColumnNames: string[] = [];
        private _masterTable: IMasterTable;
        private _isHandlingSpecialPlacementCase: boolean;
        private _specialCasePlaceholder: string;
        private static _datetimeTypes: string[] = ['DateTime', 'DateTime?'];
        private static _stringTypes: string[] = ['String'];
        private static _floatTypes: string[] = ['Single', 'Double', 'Decimal', 'Single?', 'Double?', 'Decimal?'];
        private static _integerTypes: string[] = ['Int32', 'Int64', 'Int16', 'SByte', 'Byte', 'UInt32', 'UInt64', 'UInt16', 'Int32?', 'Int64?', 'Int16?', 'SByte?', 'Byte?', 'UInt32?', 'UInt64?', 'UInt16?'];
        private static _booleanTypes: string[] = ['Boolean', 'Boolean?'];

        /*
         * @internal
         */
        public static classifyType(fieldType: string): IClassifiedType {
            return {
                IsDateTime: InstanceManagerService._datetimeTypes.indexOf(fieldType) > -1,
                IsString: InstanceManagerService._stringTypes.indexOf(fieldType) > -1,
                IsFloat: InstanceManagerService._floatTypes.indexOf(fieldType) > -1,
                IsInteger: InstanceManagerService._integerTypes.indexOf(fieldType) > -1,
                IsBoolean: InstanceManagerService._booleanTypes.indexOf(fieldType) > -1,
                IsNullable: InstanceManagerService.endsWith(fieldType, '?')
            };
        }

        private initColumns(): void {
            var columns: IColumn[] = [];
            
            for (var i: number = 0; i < this.Configuration.Columns.length; i++) {
                var cnf: Configuration.Json.IColumnConfiguration = this.Configuration.Columns[i];
                var c = InstanceManagerService.createColumn(cnf, this._masterTable, i);
                this.Columns[c.RawName] = c;
                columns.push(c);
            }
            columns = columns.sort((a: IColumn, b: IColumn) => a.Order - b.Order);
            for (var j: number = 0; j < columns.length; j++) {
                this._rawColumnNames.push(columns[j].RawName);
            }

        }

        public static createColumn(cnf: Configuration.Json.IColumnConfiguration, masterTable: IMasterTable,order?:number): IColumn {
            var c: IColumn = {
                Configuration: cnf,
                RawName: cnf.RawColumnName,
                MasterTable: masterTable,
                Header: null,
                Order: order == null ? 0 : order,
                IsDateTime: InstanceManagerService._datetimeTypes.indexOf(cnf.ColumnType) > -1,
                IsString: InstanceManagerService._stringTypes.indexOf(cnf.ColumnType) > -1,
                IsFloat: InstanceManagerService._floatTypes.indexOf(cnf.ColumnType) > -1,
                IsInteger: InstanceManagerService._integerTypes.indexOf(cnf.ColumnType) > -1,
                IsBoolean: InstanceManagerService._booleanTypes.indexOf(cnf.ColumnType) > -1,
                IsEnum: cnf.IsEnum,
                UiOrder: 0
        };
            c.Header = {
                Column: c,
                renderContent: <any>null,
                renderElement: <any>null
            };
            return c;
        }

        /*
         * @internal
         */
        public initPlugins(): void {
            var pluginsConfiguration: Configuration.Json.IPluginConfiguration[] = this.Configuration.PluginsConfiguration;
            var specialCases: { [key: string]: IPlugin } = {};
            var anySpecialCases: boolean = false;

            // registering additional events
            ComponentsContainer.registerAllEvents(this._events, this._masterTable);

            // instantiating and initializing plugins
            for (var l: number = 0; l < pluginsConfiguration.length; l++) {
                var conf: Configuration.Json.IPluginConfiguration = pluginsConfiguration[l];
                var plugin: IPlugin = ComponentsContainer.resolveComponent<IPlugin>(conf.PluginId);
                plugin.PluginLocation = (!conf.Placement) ? conf.PluginId : `${conf.Placement}-${conf.PluginId}`;
                plugin.RawConfig = conf;
                plugin.Order = conf.Order || 0;

                plugin.init(this._masterTable);
                if (this._isHandlingSpecialPlacementCase && InstanceManagerService.startsWith(conf.Placement, this._specialCasePlaceholder)) {
                    specialCases[conf.Placement + '-'] = plugin;
                    anySpecialCases = true;
                } else {
                    this.Plugins[plugin.PluginLocation] = plugin;
                }
            }

            // handling special filters case
            if (this._isHandlingSpecialPlacementCase) {
                if (anySpecialCases) {
                    var columns: string[] = this.getUiColumnNames();
                    for (var i: number = 0; i < columns.length; i++) {
                        var c: string = columns[i];
                        var id: string = `${this._specialCasePlaceholder}-${c}-`;
                        var specialPlugin: IPlugin = null;
                        for (var k in specialCases) {
                            if (InstanceManagerService.startsWith(k, id)) {
                                specialPlugin = specialCases[k];
                            }
                        }
                        if (specialPlugin == null) {
                            specialPlugin = <IPlugin>{
                                PluginLocation: `${id}-empty`,
                                renderContent: () => { return ''; },
                                Order: 0,
                                RawConfig: null,
                                renderElement: null,
                                init: null
                            };
                        }
                        specialPlugin.Order = i;
                        this.Plugins[specialPlugin.PluginLocation] = specialPlugin;
                    }
                }
            }
            this._events.ColumnsCreation.invoke(this, this.Columns);
        }

        private static startsWith(s1: string, prefix: string): boolean {
            if (s1 == undefined || s1 === null) return false;
            if (prefix.length > s1.length) return false;
            if (s1 === prefix) return true;

            var part: string = s1.substring(0, prefix.length);
            return part === prefix;
        }

        private static endsWith(s1: string, postfix: string): boolean {
            if (s1 == undefined || s1 === null) return false;
            if (postfix.length > s1.length) return false;
            if (s1 === postfix) return true;

            var part: string = s1.substring(s1.length - postfix.length - 1, postfix.length);
            return part === postfix;
        }
        /*
         * @internal
         */
        public _subscribeConfiguredEvents() {
            var delegator = this._masterTable.Renderer.Delegator;
            
            for (var i = 0; i < this.Configuration.Subscriptions.length; i++) {
                var sub = this.Configuration.Subscriptions[i];
                if (sub.IsRowSubscription) {
                    var h = (function (hndlr) {
                        return function (e: IRowEventArgs) {
                            hndlr(e);
                        }
                    })(sub.Handler);
                    delegator.subscribeRowEvent({
                        EventId: sub.DomEvent,
                        Selector: sub.Selector,
                        Handler: h,
                        SubscriptionId: 'configured-row-' + i
                    });
                } else {
                    
                    var h2 = (sub.ColumnName==null)?sub.Handler:
                        (function (hndlr, im: InstanceManagerService, colName) {
                        return function (e: ICellEventArgs) {
                            if (im.getColumnNames().indexOf(colName) !== e.ColumnIndex) return;
                            hndlr(e);
                        }
                        })(sub.Handler, this._masterTable.InstanceManager, sub.ColumnName);

                    delegator.subscribeCellEvent({
                        EventId: sub.DomEvent,
                        Selector: sub.Selector,
                        Handler: <any>h2,
                        SubscriptionId: 'configured-cell-' + i
                    });
                }
            }
        }

        /**
        * Reteives plugin at specified placement
        * @param pluginId Plugin ID 
        * @param placement Pluign placement
        */
        public getPlugin<TPlugin>(pluginId: string, placement?: string): TPlugin {
            if (!placement) placement = '';
            var key: string = placement.length === 0 ? pluginId : `${placement}-${pluginId}`;
            if (this.Plugins[key]) return <any>(this.Plugins[key]);
            else {
                for (var k in this.Plugins) {
                    if (this.Plugins.hasOwnProperty(k)) {
                        var plg: IPlugin = this.Plugins[k];
                        if (InstanceManagerService.startsWith(plg.RawConfig.PluginId, pluginId)) return <any>plg;
                    }
                }
            }
            throw new Error(`There is no plugin ${pluginId} on place ${placement}`);
        }

        /**
         * Retrieves plugins list at specific placement 
         * 
         * @param placement Plugins placement
         * @returns {} 
         */
        public getPlugins(placement: string): IPlugin[] {
            var result: IPlugin[] = [];
            if (!InstanceManagerService.endsWith(placement,"-")) placement += "-";
            for (var k in this.Plugins) {
                if (this.Plugins.hasOwnProperty(k)) {
                    var kp = (k + "-").substring(0, placement.length);
                    if (kp === placement) {
                        result.push(this.Plugins[k]);
                    }
                }
            }
            result = result.sort((a: IPlugin, b: IPlugin) => {
                return a.Order - b.Order;
            });
            return result;
        }

        /**
         * Reteives plugin at specified placement
         * @param pluginId Plugin ID 
         * @param placement Pluign placement
         * @returns {} 
         */
        public getColumnFilter<TPlugin>(columnName: string): TPlugin {
            var filterId: string = `filter-${columnName}`;
            for (var k in this.Plugins) {
                if (this.Plugins.hasOwnProperty(k)) {
                    var kp = k.substring(0, filterId.length);
                    if (kp === filterId) return <any>this.Plugins[k];
                }
            }
            throw new Error(`There is no filter for ${columnName}`);
        }

        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {} 
         */
        public getColumnNames(): string[] {
            return this._rawColumnNames;
        }

        /**
         * Retrieves sequential columns names in corresponding order
         * @returns {} 
         */
        public getUiColumnNames(): string[] {
            var result: any[] = [];
            var uiCol: IColumn[] = this.getUiColumns();
            for (var i: number = 0; i < uiCol.length; i++) {
                result.push(uiCol[i].RawName);
            }
            return result;
        }

        /**
         * Retreives columns suitable for UI rendering in corresponding order
         * 
         * @returns {} 
         */
        public getUiColumns(): IColumn[] {
            var result: any[] = [];
            for (var ck in this.Columns) {
                if (this.Columns.hasOwnProperty(ck)) {
                    var col: IColumn = this.Columns[ck];
                    if (col.Configuration.IsDataOnly) continue;
                    result.push(col);
                }
            }
            result = result.sort((a, b) => a.Configuration.DisplayOrder - b.Configuration.DisplayOrder);
            for (var i = 0; i < result.length; i++) {
                result[i].UiOrder = i;
            }
            return result;
        }

        /**
         * Retrieves column by its raw name
         * 
         * @param columnName Raw column name
         * @returns {} 
         */
        public getColumn(columnName: string): IColumn {
            if (!this.Columns.hasOwnProperty(columnName))
                throw new Error(`Column ${columnName} not found for rendering`);
            return this.Columns[columnName];
        }

        public getColumnByOrder(columnOrder: number): IColumn {
            return this.Columns[this._rawColumnNames[columnOrder]];
        }
    }

    /*
    * @internal
    */
    export interface IClassifiedType {
        IsDateTime: boolean;
        IsString: boolean;
        IsFloat: boolean;
        IsInteger: boolean;
        IsBoolean: boolean;
        IsNullable: boolean;
    }
}