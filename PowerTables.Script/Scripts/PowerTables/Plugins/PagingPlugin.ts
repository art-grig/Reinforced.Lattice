module PowerTables.Plugins.Paging {
    export class PagingPlugin extends PowerTables.Filters.FilterBase<Plugins.Paging.IPagingClientConfiguration> {

        public Pages: IPagesElement[];
        public Shown: boolean;
        public NextArrow: boolean;
        public PrevArrow: boolean;

        private _selectedPage: number = 0;

        public CurrentPage() { return this._selectedPage + 1; }

        public TotalPages() { return this._totalPages; }

        public PageSize() { return this._pageSize; }

        private _totalPages: number;
        private _pageSize: number;

        public GotoInput: HTMLInputElement;

        public getCurrentPage() {
            return this._selectedPage;
        }

        public getTotalPages() {
            return this._totalPages;
        }

        public getPageSize() {
            return this._pageSize;
        }

        private onFilterGathered(e: ITableEventArgs<IQueryGatheringEventArgs>) {
            this._pageSize = e.EventArgs.Query.Paging.PageSize;
        }
        private onColumnsCreation() {
            if (this.Configuration.EnableClientPaging && !this.MasterTable.DataHolder.EnableClientTake) {
                var limit: any = null;
                try {
                    limit = this.MasterTable.InstanceManager.getPlugin('Limit');
                } catch (a) { }
                if (limit != null)
                    throw new Error('Paging ang Limit plugins must both work locally or both remote. Please enable client limiting');
            }
        }

        private onResponse(e: ITableEventArgs<IDataEventArgs>) {
            this._selectedPage = e.EventArgs.Data.PageIndex;
            var tp: number = e.EventArgs.Data.ResultsCount / this._pageSize;
            if (tp !== parseInt(<any>tp)) {
                tp = parseInt(<any>tp) + 1;
            }
            this._totalPages = tp;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        private onClientDataProcessing(e: ITableEventArgs<IClientDataResults>) {
            var tp: number = e.EventArgs.Filtered.length / this._pageSize;
            if (tp !== parseInt(<any>tp)) {
                tp = parseInt(<any>tp) + 1;
            }
            if (tp < this._selectedPage) {
                this._selectedPage = 0;
            }
            this._totalPages = tp;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        public goToPage(page: string) {
            this._selectedPage = parseInt(page);
            this.MasterTable.Controller.reload();
        }

        public gotoPageClick(e: Rendering.ITemplateBoundEvent) {
            if (this.GotoInput) {
                var v: string = this.GotoInput.value;
                v = (parseInt(v) - 1).toString();
                this.goToPage(v);
            }
        }

        public navigateToPage(e: Rendering.ITemplateBoundEvent) {
            this.goToPage(e.EventArguments[0]);
        }

        public nextClick(e: Rendering.ITemplateBoundEvent) {
            if (this._selectedPage < this._totalPages) this.goToPage((this._selectedPage + 1).toString());
        }

        public previousClick(e: Rendering.ITemplateBoundEvent) {
            if (this._selectedPage > 0) this.goToPage((this._selectedPage - 1).toString());
        }

        private constructPagesElements() {
            var a: IPagesElement[] = [];
            var total: number = this._totalPages;
            var cur: number = this._selectedPage;
            var pdiff: number = this.Configuration.PagesToHideUnderPeriod;

            if (total > 1) {
                this.Shown = true;
                if (!this.Configuration.ArrowsMode) {
                    if (this.Configuration.UseFirstLastPage) a.push({ Page: 0, First: true });

                    if (cur > 0) a.push({ Page: 0, Prev: true });
                    if (this.Configuration.UsePeriods) {
                        if (cur - 1 >= pdiff) a.push({ Page: 0, Period: true });

                        if (cur - 1 > 0) a.push({ Page: cur - 1, InActivePage: true });
                        a.push({ Page: cur, ActivePage: true });
                        if (cur + 1 < total) a.push({ Page: cur + 1, InActivePage: true });

                        if (total - (cur + 1) >= pdiff) a.push({ Page: 0, Period: true });
                    } else {
                        for (var i: number = 0; i < total; i++) {
                            if (cur === i) {
                                a.push({ Page: i, ActivePage: true });
                            } else {
                                a.push({ Page: i, InActivePage: true });
                            }
                        }
                    }
                    if (cur < total - 1) a.push({ Page: 0, Next: true });

                    if (this.Configuration.UseFirstLastPage) a.push({ Page: total - 1, Last: true });

                    var disFunction: () => any = function () { return this.Page + 1; }
                    for (var j: number = 0; j < a.length; j++) {
                        a[j].DisPage = disFunction;
                    }
                    this.Pages = a;
                } else {
                    this.NextArrow = cur < total - 1;
                    this.PrevArrow = cur > 0;
                }
            } else {
                this.Shown = false;
            }
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            this.constructPagesElements();
            return templatesProvider.getCachedTemplate('paging')(this);
        }

        public validateGotopage() {
            var v: string = this.GotoInput.value;
            var i: number = parseInt(v);
            var valid: boolean = !isNaN(i) && (i > 0) && (i <= this._totalPages);
            if (valid) {
                this.VisualStates.normalState();
            } else {
                this.VisualStates.changeState('invalid');
            }
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            if (this.Configuration.EnableClientPaging && scope===QueryScope.Client) {
                query.Paging.PageIndex = this._selectedPage;
            }

            if ((!this.Configuration.EnableClientPaging) && scope !== QueryScope.Client) {
                query.Paging.PageIndex = this._selectedPage;
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (!this.Configuration.EnableClientPaging) {
                this.MasterTable.Events.AfterQueryGathering.subscribe(this.onFilterGathered.bind(this), 'paging');
            } else {
                this.MasterTable.Events.AfterClientQueryGathering.subscribe(this.onFilterGathered.bind(this), 'paging');
            }
            if (!this.Configuration.EnableClientPaging) {
                this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this), 'paging');
            } else {
                this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientDataProcessing.bind(this), 'paging');
            }
            this.MasterTable.Events.ColumnsCreation.subscribe(this.onColumnsCreation.bind(this), 'paging');

            if (this.Configuration.EnableClientPaging) {
                this.MasterTable.DataHolder.EnableClientSkip = true;
            }
        }
    }

    export interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        Next?:boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }

    

    ComponentsContainer.registerComponent('Paging',PagingPlugin);
} 