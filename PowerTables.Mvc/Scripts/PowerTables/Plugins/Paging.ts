module PowerTables {
    import PagingClientConfiguration = PowerTables.Plugins.Paging.IPagingClientConfiguration;

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

    export class PagingPlugin
        extends PluginBase<PagingClientConfiguration>
        implements IQueryPartProvider {

        constructor() {
            super('pt-plugin-pager');
        }

        public Pages: IPagesElement[];
        public Shown: boolean;
        public NextArrow: boolean;
        public PrevArrow: boolean;

        private _selectedPage: number;
        private _totalPages: number;
        private _pageSize: number;

        private _firstDraw: boolean = true;

        private _pagerContainer: JQuery;
        private _gotoPage: JQuery;
        private _gotoPanel: JQuery;
        private _gotoPageBtn: JQuery;
        

        init(table: PowerTable, configuration: PowerTables.Configuration.Json.IPluginConfiguration): void {
            super.init(table, configuration);
            table.Events.AfterFilterGathering.subscribe(this.onFilterGathered.bind(this), 'paging');
            table.Events.ResponseDrawing.subscribe(this.onResponse.bind(this), 'paging');
        }
        private onFilterGathered(query: IQuery) {
            this._pageSize = query.Paging.PageSize;
        }

        private onResponse(response: IPowerTablesResponse) {
            this._selectedPage = response.PageIndex;
            var tp = response.ResultsCount / this._pageSize;
            if (tp !== parseInt(<any>tp)) {
                tp = parseInt(<any>tp) + 1;
            }
            this._totalPages = tp;

            var html = this.render();
            this._pagerContainer.html(html);
            this.findElements();
        }

        modifyQuery(query: IQuery): void {
            query.Paging.PageIndex = this._selectedPage;
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

        subscribeEvents(parentElement: JQuery): void {
            this._pagerContainer = parentElement;
            this.findElements();
            var _self = this;
            this._pagerContainer.delegate('[data-action="prev"]', 'click', (e) => _self.previousClick());
            this._pagerContainer.delegate('[data-action="next"]', 'click', (e) => _self.nextClick());
            this._pagerContainer.delegate('[data-action="page"]', 'click', function (e) {
                return _self.pageClick($(this).data('page'));
            });
            this._pagerContainer.delegate('[data-action="navg"]', 'click', (e) => _self.goToPageClick());

        }
        private findElements() {
            var _self = this;
            this._gotoPage = this._pagerContainer.find('input[data-action="pageInput"]');
            this._gotoPanel = this._pagerContainer.find('._gotoPanel');
            this._gotoPageBtn = this._pagerContainer.find('[data-action="navg"]');
            this._gotoPage.keyup((e) => _self.validateGotopage());
            this.validateGotopage();
        }

        private pageClick(page: string) {
            this._selectedPage = parseInt(page);
            this.MasterTable.reload();
        }

        private nextClick() {
            if (this._selectedPage < this._totalPages) this.pageClick((this._selectedPage + 1).toString());
        }

        private previousClick() {
            if (this._selectedPage > 0) this.pageClick((this._selectedPage - 1).toString());
        }

        private goToPageClick() {
            if (this._gotoPage) {
                var v = this._gotoPage.val();
                v = (parseInt(v) - 1).toString();
                this.pageClick(v);
            }
        }

        private validateGotopage() {
            var v = this._gotoPage.val();
            var i = parseInt(v);
            var valid = !isNaN(i) && (i > 0) && (i <= this._totalPages);
            if (valid) {
                this._gotoPanel.removeClass('has-error');
                this._gotoPageBtn.removeAttr('disabled');
            } else {
                this._gotoPanel.addClass('has-error');
                this._gotoPageBtn.attr('disabled', 'disabled');
            }
        }

        render(context?): string {
            this.constructPagesElements();
            return super.render(context);
        }

        IsToolbarPlugin: boolean = false;
        IsQueryModifier: boolean = true;
        PluginId: string = 'Paging';
        IsRenderable: boolean = true;
    }

    ComponentsContainer.registerComponent('Paging', PagingPlugin);
}   