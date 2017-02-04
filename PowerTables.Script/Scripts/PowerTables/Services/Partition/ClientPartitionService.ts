module PowerTables.Services.Partition {
    export class ClientPartitionService implements IPartitionService {
        constructor(masterTable: IMasterTable) {
            this._masterTable = masterTable;
        }

        protected  _masterTable: IMasterTable;

        public setSkip(skip: number): void {
            if (skip < 0) skip = 0;
            var take = this.Take;
            if (take > 0) {
                if (skip + take > this.amount()) skip = this.amount() - take;
            } else {
                take = this.amount() - skip;
            }
            var prevSkip = this.Skip;
            if (prevSkip === skip) return;

            this._masterTable.Events.PartitionChanged.invokeBefore(this,
                {
                    PreviousSkip: prevSkip,
                    Skip: skip,
                    PreviousTake: this.Take,
                    Take: this.Take
                });

            if (skip >= prevSkip + take || skip <= prevSkip - take) {
                this.cutDisplayed(skip, take);
                this._masterTable.Controller.redrawVisibleData();
            } else {
                var prevIdx = this.displayedIndexes();
                this.cutDisplayed(skip, take);
                var diff = Math.abs(prevSkip - skip);
                var down = skip > prevSkip;
                var rows = this._masterTable.Controller.produceRows();
                this.destroySpecialRows(rows);
                for (var i = 0; i < diff; i++) {
                    var toDestroy = down ? prevIdx[i] : prevIdx[prevIdx.length - 1 - i];
                    this._masterTable.Renderer.Modifier.destroyRowByIndex(toDestroy);
                }
                if (down) {
                    var li = this.lastNonSpecialIndex(rows) - diff + 1;
                    for (var j = 0; j < diff; j++) {
                        this._masterTable.Renderer.Modifier.appendRow(rows[li + j]);
                    }
                } else {
                    var fi = this.firstNonSpecialIndex(rows) + diff - 1;
                    for (var k = 0; k < diff; k++) {
                        this._masterTable.Renderer.Modifier.prependRow(rows[fi - k]);
                    }
                }
                this.restoreSpecialRows(rows);
            }
            this.Skip = skip;
            this._masterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    PreviousSkip: prevSkip,
                    Skip: skip,
                    PreviousTake: this.Take,
                    Take: this.Take
                });

        }

        private firstNonSpecialIndex(rows: IRow[]): number {
            for (var i = 0; i < rows.length; i++) {
                if (!rows[i].IsSpecial) return i;
            }
            return 0;
        }

        private lastNonSpecialIndex(rows: IRow[]): number {
            if (rows.length === 0) return 0;
            if (!rows[rows.length - 1].IsSpecial) return rows.length - 1;
            for (var i = rows.length - 1; i >= 0; i--) {
                if (!rows[i].IsSpecial) return i;
            }
            return 0;
        }

        private displayedIndexes(): number[] {
            var currentIndexes = [];
            for (var i = 0; i < this._masterTable.DataHolder.DisplayedData.length; i++) {
                currentIndexes.push(this._masterTable.DataHolder.DisplayedData[i]['__i']);
            }
            return currentIndexes;
        }

        public setTake(take: number): void {
            this._masterTable.Events.PartitionChanged.invokeBefore(this,
                {
                    PreviousSkip: this.Skip,
                    Skip: this.Skip,
                    PreviousTake: this.Take,
                    Take: take
                });
            if (take === 0) {
                //todo
            }
            var prevTake = this.Take;


            if (take < prevTake) {
                var dd = this._masterTable.DataHolder.DisplayedData;
                this.cutDisplayed(this.Skip, take);
                for (var i = take; i < prevTake; i++) {
                    this._masterTable.Renderer.Modifier.destroyRowByIndex(dd[i]['__i']);
                }
            } else {
                var prevIdx = this.displayedIndexes();
                var rows = this._masterTable.Controller.produceRows();
                this.destroySpecialRows(rows);
                this.cutDisplayed(this.Skip, take);
                rows = this._masterTable.Controller.produceRows();

                for (var j = prevIdx.length; j < rows.length; j++) {
                    this._masterTable.Renderer.Modifier.appendRow(rows[j]);
                }
                this.restoreSpecialRows(rows);
            }
            this.Take = take;
            this._masterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    PreviousSkip: this.Skip,
                    Skip: this.Skip,
                    PreviousTake: prevTake,
                    Take: take
                });

        }

        private restoreSpecialRows(rows: IRow[]) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].IsSpecial) {
                    if (i === 0) this._masterTable.Renderer.Modifier.prependRow(rows[i]);
                    else if (i === rows.length - 1) {
                        this._masterTable.Renderer.Modifier.appendRow(rows[i]);
                    } else {
                        if (rows[i + 1].IsSpecial) this._masterTable.Renderer.Modifier.appendRow(rows[i]);
                        else this._masterTable.Renderer.Modifier.appendRow(rows[i], rows[i + 1].Index);
                    }
                }
            }
        }

        private destroySpecialRows(rows: IRow[]) {
            for (var i = 0; i < rows.length / 2; i++) {
                if (rows[i].IsSpecial) this._masterTable.Renderer.Modifier.destroyRowByIndex(rows[i].Index);
                if (rows[rows.length - i - 1].IsSpecial) this._masterTable.Renderer.Modifier.destroyRowByIndex(rows[rows.length - i - 1].Index);
            }
        }

        public partitionBeforeQuery(query: IQuery, scope: QueryScope): QueryScope {
            if (scope === QueryScope.Server) {
                query.Partition = {
                    NoCount: true,
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

        public partitionBeforeCommand(serverQuery: IQuery): void {
            serverQuery.Partition = {
                NoCount: true,
                Take: this.Take,
                Skip: this.Skip
            };
        }

        public partitionAfterQuery(initialSet: any[], query: IQuery): any[] {

            return this.skipTakeSet(initialSet, query);
        }

        private skipTakeSet(ordered: any[], query: IQuery): any[] {
            return this.cut(ordered, this.Skip, this.Take);
        }

        private cut(ordered: any[], skip: number, take: number) {
            var selected = ordered;
            if (skip > ordered.length) skip = 0;
            if (take === 0) selected = ordered.slice(skip);
            else selected = ordered.slice(skip, skip + take);
            return selected;
        }

        private cutDisplayed(skip: number, take: number) {
            this._masterTable.DataHolder.RecentClientQuery.Partition = {
                NoCount: true,
                Skip: skip,
                Take: take
            };

            this._masterTable.Events.ClientDataProcessing.invokeBefore(this, this._masterTable.DataHolder.RecentClientQuery);
            this._masterTable.DataHolder.DisplayedData = this.cut(this._masterTable.DataHolder.Ordered, skip, take);
            this._masterTable.Events.ClientDataProcessing.invokeAfter(this,
                {
                    Displaying: this._masterTable.DataHolder.DisplayedData,
                    Filtered: this._masterTable.DataHolder.Filtered,
                    Ordered: this._masterTable.DataHolder.Ordered,
                    Source: this._masterTable.DataHolder.StoredData
                });
        }

        public Skip: number;
        public Take: number;


        public amount(): number {
            return (!this._masterTable.DataHolder.Ordered) ? 0 : this._masterTable.DataHolder.Ordered.length;
        }

        public isAmountFinite(): boolean {
            return true;
        }

        public totalAmount(): number {
            return this._masterTable.DataHolder.StoredData.length;
        }

        public initial(skip: number, take: number): any {
            this.Skip = skip;
            this.Take = take;
            this._masterTable.Events.PartitionChanged.invokeAfter(this,
                {
                    PreviousSkip: 0,
                    Skip: skip,
                    PreviousTake: 0,
                    Take: take
                });
        }
    }
}