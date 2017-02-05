module PowerTables.Services.Partition {
    export class PartitionIndicatorRow implements IRow {

        private _dataLoader: PowerTables.Services.Partition.BackgroundDataLoader;

        constructor(masterTable: IMasterTable, dataLoader: PowerTables.Services.Partition.BackgroundDataLoader,conf:PowerTables.IServerPartitionConfiguration) {
            this.DataObject = new PartitionIndicator(masterTable, dataLoader);
            this.MasterTable = masterTable;
            this._dataLoader = dataLoader;
            this.TemplateIdOverride = conf.LoadingRowTemplateId;
            this.Show = true;
        }

        public TemplateIdOverride: string;
        public IsSpecial: boolean = true;
        public DataObject: any;
        public Index: number = 0;
        public MasterTable: IMasterTable;
        public Cells: { [index: string]: ICell; } = {};
        public Show: boolean;
        public PagesInput: HTMLInputElement;
        public VisualState: PowerTables.Rendering.VisualState;

        public loadMore() {
            var loadPages = null;
            if (this.PagesInput) {
                loadPages = parseInt(this.PagesInput.value);
                if (isNaN(loadPages)) loadPages = null;
            }
            this._dataLoader.loadMore(this.Show, loadPages);
        }
    }

    export class PartitionIndicator implements PowerTables.IPartitionRowData {
        constructor(masterTable: IMasterTable, partitionService: PowerTables.Services.Partition.BackgroundDataLoader) {
            this._masterTable = masterTable;
            this._dataLoader = partitionService;
        }

        private _masterTable: PowerTables.IMasterTable;
        private _dataLoader: PowerTables.Services.Partition.BackgroundDataLoader;


        public UiColumnsCount(): number { return this._masterTable.InstanceManager.getUiColumns().length; }

        public IsLoading(): boolean {
            return this._dataLoader.IsLoadingNextPart;
        }

        public Stats(): IStatsModel { return this._masterTable.Stats; }

        public IsClientSearchPending(): boolean {
            return this._dataLoader.ClientSearchParameters;
        }

        public CanLoadMore(): boolean {
            return !this._dataLoader.FinishReached;
        }

        public LoadAhead(): number {
            return this._dataLoader.LoadAhead;
        }
    }
}