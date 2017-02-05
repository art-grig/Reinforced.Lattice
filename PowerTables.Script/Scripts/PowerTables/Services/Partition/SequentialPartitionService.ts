module PowerTables.Services.Partition {
    export class SequentialPartitionService extends ClientPartitionService {
        constructor(masterTable: IMasterTable) {
            super(masterTable);
            this._masterTable = masterTable;
            this._conf = masterTable.Configuration.Partition.Server;
            this._dataLoader = new PowerTables.Services.Partition.BackgroundDataLoader(masterTable);
            this._dataLoader.UseLoadMore = this._conf.UseLoadMore;
            this._dataLoader.AppendLoadingRow = this._conf.AppendLoadingRow;

            if (this._conf.AppendLoadingRow || this._conf.UseLoadMore) {
                this._masterTable.Controller.registerAdditionalRowsProvider(this);
            }
            this.Type = PowerTables.PartitionType.Sequential;
        }


        public Owner: ServerPartitionService;

        private _dataLoader: BackgroundDataLoader;
        private _conf: IServerPartitionConfiguration;

        public setSkip(skip: number, preserveTake?: boolean): void {
            if (this.Skip === 0 && skip <= 0) return;
            this._dataLoader.skipTake(skip, this.Take);
            super.setSkip(skip, preserveTake);
            if (skip + this.Take > this._masterTable.DataHolder.Ordered.length) {
                this._dataLoader.loadNextDataPart(this._conf.LoadAhead);
            } else {
                this._dataLoader.destroyIndication();
            }
        }

        private _takeDiff: number = 0;

        public setTake(take: number): void {
            var noData = !this._masterTable.DataHolder.RecentClientQuery;
            if (noData) return;
            if (this.Skip + take > this._masterTable.DataHolder.Ordered.length) {
                this._dataLoader.skipTake(this.Skip, take);
                this._dataLoader.loadNextDataPart(this._conf.LoadAhead, () => super.setTake(take));
            } else {
                super.setTake(take);
            }
        }

        public isAmountFinite(): boolean {
            return this._dataLoader.FinishReached;
        }

        public amount(): number {
            return super.amount();
        }
        private resetSkip() {
            if (this.Skip === 0) return;
            var prevSkip = this.Skip;
            this._dataLoader.skipTake(0, this.Take);
            this.Skip = 0;
            this._masterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    PreviousSkip: prevSkip,
                    Skip: this.Skip,
                    PreviousTake: this.Take,
                    Take: this.Take
                });
        }

        public partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): void {
            // Check if it is pager's request. If true - nothing to do here. All necessary things are already done in queryModifier
            if (serverQuery.IsBackgroundDataFetch) return;
            this.resetSkip();
            if (this.Owner != null) {
                var hasClientFilters = this.any(clientQuery.Filterings);
                if (!hasClientFilters) {
                    this.Owner.switchBack(serverQuery, clientQuery, isServerQuery);
                    return;
                }
            }

            serverQuery.Partition = { NoCount: true, Take: this.Take * this._conf.LoadAhead, Skip: this.Skip };

            // for client query we pass our regular parameters
            clientQuery.Partition = {
                NoCount: true,
                Take: this.Take,
                Skip: this.Skip
            };
        }

        public partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[] {
            var result = this.skipTakeSet(initialSet, query);
            if (!query.IsBackgroundDataFetch) {
                var activeClientFiltering = this.any(query.Filterings);
                this._dataLoader.ClientSearchParameters = activeClientFiltering;
                var enough = initialSet.length >= this.Take * this._conf.LoadAhead;
                if (activeClientFiltering && !enough) {
                    if (this._conf.UseLoadMore) {
                        this._provideIndication = true;
                    } else {
                        this._backgroundLoad = true;
                    }
                }
            }
            return result;
        }


        private _provideIndication: boolean = false;
        private _backgroundLoad: boolean = false;
        public provide(rows: IRow[]): void {
            this._dataLoader.skipTake(this.Skip, this.Take);
            if (this._provideIndication) {
                this._dataLoader.provideIndicator(rows);
                this._provideIndication = false;
            }
            if (this._backgroundLoad) {
                this._backgroundLoad = false;
                this._dataLoader.loadNextDataPart(this._conf.LoadAhead);
            }
        }
        public hasEnoughDataToSkip(skip: number): boolean {
            if (skip < 0) return false;
            if (skip > this.amount() - this.Take) return false;

            return (skip > 0) && (skip <= (this._masterTable.DataHolder.Ordered.length - this.Take));
        }
        public isClient(): boolean { return false; }

        public isServer(): boolean { return true; }
    }
}