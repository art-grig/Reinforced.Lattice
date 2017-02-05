module PowerTables.Services.Partition {
    export class ServerPartitionService extends ClientPartitionService {
        private _loadAhead: number;
        private _noCount: boolean;
        private _modifyDataAppendQuery: any;
        private _dataAppendLoaded: any;
        private _dataAppendError: any;
        constructor(masterTable: IMasterTable) {
            super(masterTable);
            this._masterTable = masterTable;
            this._loadAhead = masterTable.InstanceManager.Configuration.Partition.LoadAhead;
            this._noCount = masterTable.InstanceManager.Configuration.Partition.NoCount;
            this._modifyDataAppendQuery = this.modifyDataAppendQuery.bind(this);
            this._dataAppendLoaded = this.dataAppendLoaded.bind(this);
            this._dataAppendError = this.dataAppendError.bind(this);
        }
        private _serverSkip: number = 0;

        public setSkip(skip: number, preserveTake?: boolean): void {
            if (this.Skip === 0 && skip <= 0 && this._serverSkip === 0) return;
            var iSkip = skip - this._serverSkip;
            if ((iSkip + (this.Take * 2) > this._masterTable.DataHolder.Ordered.length) || (iSkip < 0)) {
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
                    this.loadNextDataPart();
                }
            }
            super.setSkip(skip, preserveTake);
        }

        protected cut(ordered: any[], skip: number, take: number) {
            skip = skip - this._serverSkip;
            var selected = ordered;
            if (skip > ordered.length) skip = 0;
            if (take === 0) selected = ordered.slice(skip);
            else selected = ordered.slice(skip, skip + take);
            return selected;
        }

        public setTake(take: number): void {
            var iSkip = this.Skip - this._serverSkip;
            super.setTake(take);
            if ((iSkip + (take * 2) > this._masterTable.DataHolder.Ordered.length)) {
                this.loadNextDataPart();
            }
            
        }

        //#region Data parts loading
        private loadNextDataPart() {
            if (this._finishReached) return;
            this._masterTable.Loader.query(
                this._dataAppendLoaded,
                this._modifyDataAppendQuery,
                this._dataAppendError,
                true
            );
        }
        private dataAppendError(data: any) {

        }
        private dataAppendLoaded(data: IPowerTablesResponse) {
            this._finishReached = (data.BatchSize < this.Take * this._loadAhead);
        }

        private modifyDataAppendQuery(q: IQuery): IQuery {
            q.IsBackgroundDataFetch = true;
            q.Partition = {
                NoCount: true,
                Skip: this._serverSkip + this._masterTable.DataHolder.StoredData.length,
                Take: this.Take * this._loadAhead
            }
            return q;
        }
        //#endregion

        private resetSkip() {
            var prevSkip = this.Skip;
            this.Skip = 0;
            this._masterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    PreviousSkip: prevSkip,
                    Skip: this.Skip,
                    PreviousTake: this.Take,
                    Take: this.Take
                });
        }

        private _previousClientQuery: string;

        public partitionBeforeQuery(serverQuery: IQuery, clientQuery: IQuery, isServerQuery: boolean): void {
            // Check if it is pager's request. If true - nothing to do here. All necessary things are already done in queryModifier
            if (serverQuery.IsBackgroundDataFetch) return;

            var hasClientFilters = ServerPartitionService.any(clientQuery.Filterings);

            // in case if we have client filters...
            if (hasClientFilters) {
                this._activeClientFiltering = true;
                // we will do append manually, so in  first N pages here
                serverQuery.Partition = { NoCount: true, Take: this.Take * this._loadAhead, Skip: 0 };
                var pQ = JSON.stringify(clientQuery);
                var queriesEqual = (pQ === this._previousClientQuery);
                this._previousClientQuery = pQ;
                if (isServerQuery || !queriesEqual) {
                    this.resetSkip();
                }
            } // in case if not - well, it seems that it is honest data request
            else {
                if (this._activeClientFiltering) {
                    this._activeClientFiltering = false;
                    this.resetSkip();
                }
                serverQuery.Partition = { NoCount: this._noCount, Take: this.Take * this._loadAhead, Skip: this.Skip };
            }

            // for client query we pass our regular parameters
            clientQuery.Partition = {
                NoCount: true,
                Take: this.Take,
                Skip: this.Skip
            };
        }



        public partitionAfterQuery(initialSet: any[], query: IQuery, serverCount: number): any[] {
            if (serverCount !== -1) this._serverTotalCount = serverCount;
            var result = this.skipTakeSet(initialSet, query);
            if (this._activeClientFiltering) {
                if (initialSet.length < this.Take * this._loadAhead) {
                    console.log("not enough data, loading");
                    setTimeout(() => this.loadNextDataPart(), 5);
                } else {
                    console.log("enough data loaded");
                }
            }
            return result;
        }

        private static any(o: any) {
            for (var k in o) if (o.hasOwnProperty(k)) return true;
            return false;
        }

        private _serverTotalCount: number;

        private _finishReached: boolean;
        private _activeClientFiltering: boolean;

        public isAmountFinite(): boolean {
            if (this._noCount) {
                return this._finishReached;
            }
            return !this._activeClientFiltering;
        }

        public totalAmount(): number {
            return this.isAmountFinite() ? this._serverTotalCount : 0;
        }

        public amount(): number {
            return this._noCount ? super.amount() : this._serverTotalCount;
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