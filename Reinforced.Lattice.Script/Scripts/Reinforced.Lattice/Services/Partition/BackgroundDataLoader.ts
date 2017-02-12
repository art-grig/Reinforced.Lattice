module Reinforced.Lattice.Services.Partition {
    export class BackgroundDataLoader {
        constructor(masterTable: IMasterTable, conf: Reinforced.Lattice.IServerPartitionConfiguration) {
            this._masterTable = masterTable;
            this.Indicator = new Reinforced.Lattice.Services.Partition.PartitionIndicatorRow(masterTable, this, conf);
            this.LoadAhead = conf.LoadAhead;
            this.AppendLoadingRow = conf.AppendLoadingRow;
            this.UseLoadMore = conf.UseLoadMore;
        }

        private _masterTable: IMasterTable;
        private _dataAppendError: any;
        public Indicator: PartitionIndicatorRow;
        public LoadAhead: number;

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
            rows.push(this.Indicator);
        }

        private _afterFn: any = null;
        public loadNextDataPart(pages?: number, after?: any) {
            if (this.IsLoadingNextPart) {
                if (after != null) this._afterFn = after;
                return;
            }
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

        private loadNextCore(pages?: number, show?: boolean) {
            if (pages == null) pages = this.LoadAhead;
            if (show == null) show = false;
            this.IsLoadingNextPart = true;

            this.ClientSearchParameters = BackgroundDataLoader.any(this._masterTable.DataHolder.RecentClientQuery.Filterings);
            if (this.AppendLoadingRow) this.showIndication();

            this._masterTable.Loader.query(
                (d) => this.dataAppendLoaded(d, pages, show),
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
        private dataAppendLoaded(data: ILatticeResponse, pagesRequested: number, show: boolean) {
            this.IsLoadingNextPart = false;
            if (this.AppendLoadingRow) this.destroyIndication();
            this.FinishReached = (data.BatchSize < this.Take * pagesRequested);
            if (this._masterTable.DataHolder.DisplayedData.length > 0) this._masterTable.Controller.redrawVisibleData();
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
            this._masterTable.Renderer.Modifier.appendRow(this.Indicator);
            this._indicationShown = true;
        }

        public destroyIndication() {
            if (!this._indicationShown) return;
            this._masterTable.Renderer.Modifier.destroyPartitionRow();
            this._indicationShown = false;
        }

        public loadMore(show: boolean, page?: number) {
            this.destroyIndication();
            this.loadNextCore(page, show);
        }
    }
}