module PowerTables.Services.Partition {
    export class ServerPartitionService extends  ClientPartitionService {
        private _loadAhead: number;
        private _noCount: boolean;
        
        constructor(masterTable: IMasterTable) {
            super(masterTable);
            this._masterTable = masterTable;
            this._loadAhead = masterTable.InstanceManager.Configuration.Partition.LoadAhead;
            this._noCount = masterTable.InstanceManager.Configuration.Partition.NoCount;
        }

        public setSkip(skip: number): void {
            if (skip + this.Take > this.amount()) {
                this._masterTable.Loader.query(data => { },
                (q) => {
                    return q;
                },null,true);
            }
            super.setSkip(skip);
        }

        public setTake(take: number): void {
            if (this.Skip + take > this.amount()) {
                // todo trigger load data here
            }
            super.setSkip(take);
        }

        public partitionBeforeQuery(query: IQuery, scope: QueryScope): QueryScope {
            if (scope === QueryScope.Server) {
                query.Partition = {
                    NoCount: this._noCount,
                    Take: 0,
                    Skip: 0
                };
            } else {
                query.Partition = {
                    NoCount: true,
                    Take: this.Take,
                    Skip: this.Skip
                };
            }
            return scope;
        }

        public partitionAfterQuery(initialSet: any[], query: IQuery): any[] {
             throw new Error("Not implemented");
        }

        private _serverTotalCount: number;

        private _allLoaded: boolean;
        private _activeClientFiltering: boolean;

        public isAmountFinite(): boolean {
            if (this._noCount) {
                return this._allLoaded;
            }
            return !this._activeClientFiltering;
        }

        public totalAmount(): number {
            return this.isAmountFinite() ? this._serverTotalCount : 0;
        }
    }
}