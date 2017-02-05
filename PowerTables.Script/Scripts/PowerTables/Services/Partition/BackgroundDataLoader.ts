module PowerTables.Services.Partition {
    export class BackgroundDataLoader {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._indicator = new PowerTables.Services.Partition.PartitionIndicatorRow(masterTable, this);
            this.LoadAhead = masterTable.Configuration.Partition.Server.LoadAhead;
        }

        private _masterTable: IMasterTable;
        private _dataAppendError: any;
        private _indicator: PartitionIndicatorRow;
        public  LoadAhead: number;

        public AppendLoadingRow: boolean;
        public FinishReached: boolean;
        public IsLoadingNextPart: boolean;
        public UseLoadMore: boolean;

        public Skip: number;
        public Take: number;

        public skipTake(skip: number, take: number) {
            this.Skip = skip;
            this.Take = take;
        }

        public provideIndicator(rows: IRow[]) {
            this._indicationShown = true;
            rows.push(this._indicator);
        }

        private _afterFn:any = null;
        public loadNextDataPart(pages?: number, after?: any) {
            if (this.FinishReached) {
                if (after != null) after();
                return;
            }
            this._afterFn = after;
            if (this.UseLoadMore) {
                this.showIndication();
                return;
            }
            this.loadNextCore(pages);
        }

        private loadNextCore(pages?: number, show?:boolean) {
            if (pages == null) pages = this.LoadAhead;
            if (show == null) show = false;
            this.ClientSearchParameters = BackgroundDataLoader.any(this._masterTable.DataHolder.RecentClientQuery.Filterings);

            this.IsLoadingNextPart = true;
            if (this.AppendLoadingRow) this.showIndication();

            this._masterTable.Loader.query(
                (d) => this.dataAppendLoaded(d, pages,show),
                (q) => this.modifyDataAppendQuery(q, pages),
                this._dataAppendError,
                true
            );
        }
        private dataAppendError(data: any) {
            this.IsLoadingNextPart = false;
            if (this.AppendLoadingRow) this.destroyIndication();
        }

        private modifyDataAppendQuery(q: IQuery, pages: number): IQuery {
            q.IsBackgroundDataFetch = true;
            q.Partition = {
                NoCount: true,
                Skip: this._masterTable.DataHolder.StoredData.length,
                Take: this.Take * pages
            }

            return q;
        }

        private static any(o: any) {
            for (var k in o) if (o.hasOwnProperty(k)) return true;
            return false;
        }
        private dataAppendLoaded(data: IPowerTablesResponse, pagesRequested: number, show:boolean) {
            this.IsLoadingNextPart = false;
            if (this.AppendLoadingRow) this.destroyIndication();
            this.FinishReached = (data.BatchSize < this.Take * pagesRequested);
            this._masterTable.Controller.redrawVisibleData();
            if (this._masterTable.DataHolder.Ordered.length < this.Take * pagesRequested) {
                //console.log("not enough data, loading");
                if (this.UseLoadMore) {
                    this.destroyIndication();
                    if (!this.FinishReached) {
                        this.showIndication();
                    }
                } else {
                    if (!this.FinishReached) {
                        setTimeout(() => this.loadNextDataPart(pagesRequested), 5);
                    }
                }
            } else {
                if (this._afterFn != null) {
                    this._afterFn();
                    this._afterFn = null;
                }
                //console.log("enough data loaded");
            }
        }

        public ClientSearchParameters: boolean;

        private _indicationShown: boolean = false;
        public showIndication() {
            if (this._indicationShown) return;
            this._masterTable.Renderer.Modifier.appendRow(this._indicator);
            this._indicationShown = true;
        }

        public destroyIndication() {
            if (!this._indicationShown) return;
            this._masterTable.Renderer.Modifier.destroyPartitionRow();
            this._indicationShown = false;
        }

        public loadMore(page?: number) {
            this.destroyIndication();
            this.loadNextCore(page,true);
        }
    }
}