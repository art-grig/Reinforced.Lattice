module PowerTables.Services.Partition {
    export class ServerPartitionService extends ClientPartitionService {

        constructor(masterTable: IMasterTable) {
            super(masterTable);
            this._masterTable = masterTable;
            this._conf = masterTable.Configuration.Partition.Server;
            this._seq = new PowerTables.Services.Partition.SequentialPartitionService(masterTable);
            this._dataLoader = new PowerTables.Services.Partition.BackgroundDataLoader(masterTable,this._conf);
            this._dataLoader.UseLoadMore = this._conf.UseLoadMore;
            this._dataLoader.AppendLoadingRow = this._conf.AppendLoadingRow;
            this._dataLoader.Indicator.Show = false;

            this.Type = PowerTables.PartitionType.Server;
        }
        private _seq: PowerTables.Services.Partition.SequentialPartitionService;
        private _conf: IServerPartitionConfiguration;
        private _serverSkip: number = 0;
        private _indicator: PartitionIndicatorRow;
        private _dataLoader: BackgroundDataLoader;

        public setSkip(skip: number, preserveTake?: boolean): void {
            if (this.Skip === 0 && skip <= 0 && this._serverSkip === 0) return;
            var iSkip = skip - this._serverSkip;

            if (((iSkip + this.Take*2) > this._masterTable.DataHolder.Ordered.length) || (iSkip < 0)) {
                if ((iSkip > this._masterTable.DataHolder.Ordered.length) || (iSkip < 0)) {
                    var prevSkip = this.Skip;
                    this.Skip = skip;
                    this._masterTable.Events.PartitionChanged.invokeAfter(this,
                        {
                            PreviousSkip: prevSkip,
                            Skip: this.Skip,
                            PreviousTake: this.Take,
                            Take: this.Take
                        });
                    this._serverSkip = skip;
                    this._masterTable.Controller.reload(true);
                    return;
                } else {
                    this._dataLoader.skipTake(skip, this.Take);
                    this._dataLoader.loadNextDataPart(this._conf.LoadAhead);
                    super.setSkip(skip, preserveTake);
                    return;
                }
            }
            super.setSkip(skip, preserveTake);
        }

        protected cut(ordered: any[], skip: number, take: number) {
            skip = skip - this._serverSkip;
            var selected = null;
            if (skip > ordered.length) skip = 0;
            if (take === 0) selected = ordered.slice(skip);
            else selected = ordered.slice(skip, skip + take);
            return selected;
        }

        public setTake(take: number): void {
            var iSkip = this.Skip - this._serverSkip;
            var noData = !this._masterTable.DataHolder.RecentClientQuery;
            super.setTake(take);
            if (noData) return;
            if ((iSkip + (take * 2) > this._masterTable.DataHolder.Ordered.length)) {
                this._dataLoader.skipTake(this.Skip, take);
                this._dataLoader.loadNextDataPart(this._conf.LoadAhead, () => super.setTake(take));
            }
        }

        public partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): boolean {
            // Check if it is pager's request. If true - nothing to do here. All necessary things are already done in queryModifier
            if (serverQuery.IsBackgroundDataFetch) return isServerQuery;
            this._dataLoader.skipTake(this.Skip, this.Take);
            var hasClientFilters = this.any(clientQuery.Filterings);
            // in case if we have client filters we're switching to sequential partitioner
            if (hasClientFilters) {
                this.switchToSequential();
                this._seq.partitionBeforeQuery(serverQuery, clientQuery, isServerQuery);
                return true;
            }
            else {
                serverQuery.Partition = { NoCount: false, Take: this.Take * this._conf.LoadAhead, Skip: this.Skip };
            }

            // for client query we pass our regular parameters
            clientQuery.Partition = {
                NoCount: true,
                Take: this.Take,
                Skip: this.Skip
            };
            return isServerQuery;
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
        private switchToSequential() {
            this._masterTable.Partition = this._seq;
            this._seq.Owner = this;
            this._seq.Take = this.Take;
        }

        public switchBack(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean) {
            this._masterTable.Partition = this;
            this.partitionBeforeQuery(serverQuery, clientQuery, isServerQuery);
            this.Take = this._seq.Take;
            this.resetSkip();
        }

        private _provideIndication: boolean;

        public partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[] {
            if (serverCount !== -1) this._serverTotalCount = serverCount;
            var result = this.skipTakeSet(initialSet, query);
            return result;
        }

        private _serverTotalCount: number;

        public isAmountFinite(): boolean {
            return true;
        }

        public totalAmount(): number {
            return this._serverTotalCount;
        }

        public amount(): number {
            return this._serverTotalCount;
        }

        public isClient(): boolean { return false; }

        public isServer(): boolean { return true; }

        public hasEnoughDataToSkip(skip: number): boolean {
            if (skip < 0) return false;
            if (skip > this.amount() - this.Take) return false;
            var iSkip = skip - this._serverSkip;

            return (iSkip > 0) && (iSkip <= (this._masterTable.DataHolder.Ordered.length - this.Take));
        }


    }
}