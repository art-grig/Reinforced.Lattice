module PowerTables.Plugins {
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;
    import PagingClientConfiguration = PowerTables.Plugins.Paging.IPagingClientConfiguration;

    export class PagingPlugin extends FilterBase<PagingClientConfiguration> {
        public Pages: IPagesElement[];
        public Shown: boolean;
        public NextArrow: boolean;
        public PrevArrow: boolean;

        private _selectedPage: number;
        private _totalPages: number;
        private _pageSize: number;

        public GotoPanel: HTMLElement;
        public GotoBtn: HTMLElement;
        public GotoInput: HTMLInputElement;

        private onFilterGathered(e: ITableEventArgs<IQueryGatheringEventArgs>) {
            this._pageSize = e.EventArgs.Query.Paging.PageSize;
        }

        private onResponse(e: ITableEventArgs<IDataEventArgs>) {
            this._selectedPage = e.EventArgs.Data.PageIndex;
            var tp = e.EventArgs.Data.ResultsCount / this._pageSize;
            if (tp !== parseInt(<any>tp)) {
                tp = parseInt(<any>tp) + 1;
            }
            this._totalPages = tp;
            this.MasterTable.Renderer.redrawPlugin(this);
        }

        private pageClick(page: string) {
            this._selectedPage = parseInt(page);
            this.MasterTable.Controller.reload();
        }

        public gotoPageClick(e: TemplateBoundEvent<PagingPlugin>) {
            if (this.GotoInput) {
                var v = this.GotoInput.value;
                v = (parseInt(v) - 1).toString();
                this.pageClick(v);
            }
        }

        public navigateToPage(e: TemplateBoundEvent<PagingPlugin>) {
            this.pageClick(e.EventArguments[0]);
        }

        public nextClick(e: TemplateBoundEvent<PagingPlugin>) {
            if (this._selectedPage < this._totalPages) this.pageClick((this._selectedPage + 1).toString());
        }

        public previousClick(e: TemplateBoundEvent<PagingPlugin>) {
            if (this._selectedPage > 0) this.pageClick((this._selectedPage - 1).toString());
        }

        private constructPagesElements() {
            var a: IPagesElement[] = [];
            var total = this._totalPages;
            var cur = this._selectedPage;
            var pdiff = this.Configuration.PagesToHideUnderPeriod;

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
                        for (var i = 0; i < total; i++) {
                            if (cur === i) {
                                a.push({ Page: i, ActivePage: true });
                            } else {
                                a.push({ Page: i, InActivePage: true });
                            }
                        }
                    }
                    if (cur < total - 1) a.push({ Page: 0, Next: true });

                    if (this.Configuration.UseFirstLastPage) a.push({ Page: total - 1, Last: true });

                    var disFunction = function () { return this.Page + 1; }
                    for (var j = 0; j < a.length; j++) {
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

        renderContent(templatesProvider: ITemplatesProvider): string {
            this.constructPagesElements();
            return templatesProvider.getCachedTemplate('paging')(this);
        }

        public validateGotopage() {
            var v = this.GotoInput.value;
            var i = parseInt(v);
            var valid = !isNaN(i) && (i > 0) && (i <= this._totalPages);
            if (valid) {
                this.GotoPanel.classList.remove('has-error');
                this.GotoBtn.removeAttribute('disabled');
            } else {
                this.GotoPanel.classList.add('has-error');
                this.GotoBtn.setAttribute('disabled', 'disabled');
            }
        }

        modifyQuery(query: IQuery, scope: QueryScope): void {
            
        }

        init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this.MasterTable.Events.AfterQueryGathering.subscribe(this.onFilterGathered.bind(this),'paging');
            this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this),'paging');
        }
    }

    export interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }
    ComponentsContainer.registerComponent('Paging',PagingPlugin);
} 