module PowerTables.Services.Partition {
    export class PartitionIndicator implements PowerTables.IPartitionRowData {
        constructor(masterTable: IMasterTable, partitionService: PowerTables.Services.Partition.ServerPartitionService) {
            this._masterTable = masterTable;
            this._partitionService = partitionService;
        }

        private _masterTable: PowerTables.IMasterTable;
        private _partitionService:PowerTables.Services.Partition.ServerPartitionService;


        public UiColumnsCount(): number { return this._masterTable.InstanceManager.getUiColumns().length; }

        public IsLoading(): boolean {
            return this._masterTable.Loader.isLoading();
        }

        public Stats(): IStatsModel { return this._masterTable.Stats; }

        public IsClientSearchPending(): boolean {
             throw new Error("Not implemented");
        }

        public CanLoadMore(): boolean {
             throw new Error("Not implemented");
        }
    }
}