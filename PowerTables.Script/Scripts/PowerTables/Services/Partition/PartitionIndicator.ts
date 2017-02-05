module PowerTables.Services.Partition {
    export class PartitionIndicatorRow implements IRow {
        
        private _partitionService: PowerTables.Services.Partition.ServerPartitionService;

        constructor(masterTable: IMasterTable, partitionService: PowerTables.Services.Partition.ServerPartitionService) {
            this.DataObject = new PartitionIndicator(masterTable, partitionService);
            this.MasterTable = masterTable;
            this._partitionService = partitionService;
            this.TemplateIdOverride = masterTable.Configuration.Partition.Server.LoadingRowTemplateId;
        }

        public TemplateIdOverride:string;
        public IsSpecial:boolean = true;
        public DataObject: any;
        public Index: number = 0;
        public MasterTable: IMasterTable;
        public Cells: { [index: string]: ICell; } = {};

        public PagesInput: HTMLInputElement;
        public VisualState: PowerTables.Rendering.VisualState;

        public loadMore() {
            var loadPages = null;
            if (this.PagesInput) {
                loadPages = parseInt(this.PagesInput.value);
            }
            this._partitionService.loadMore(loadPages);
        }
    }
    
    export class PartitionIndicator implements PowerTables.IPartitionRowData {
        constructor(masterTable: IMasterTable, partitionService: PowerTables.Services.Partition.ServerPartitionService) {
            this._masterTable = masterTable;
            this._partitionService = partitionService;
        }

        private _masterTable: PowerTables.IMasterTable;
        private _partitionService: PowerTables.Services.Partition.ServerPartitionService;


        public UiColumnsCount(): number { return this._masterTable.InstanceManager.getUiColumns().length; }

        public IsLoading(): boolean {
            return this._masterTable.Loader.isLoading() || this._partitionService.IsLoadingNextPart;
        }

        public Stats(): IStatsModel { return this._masterTable.Stats; }

        public IsClientSearchPending(): boolean {
            return this._partitionService.ActiveClientFiltering;
        }

        public CanLoadMore(): boolean {
            return !this._partitionService.FinishReached;
        }

        
    }
}