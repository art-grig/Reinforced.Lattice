module Reinforced.Lattice.Plugins.Paging {
    export class PagingPlugin extends Reinforced.Lattice.Plugins.PluginBase<Plugins.Paging.IPagingClientConfiguration> {

        public Pages: IPagesElement[];
        public Shown: boolean;
        public NextArrow: boolean;
        public PrevArrow: boolean;

        public CurrentPage() { return this.MasterTable.Stats.CurrentPage() + 1; }
        public TotalPages() { return this.MasterTable.Stats.Pages(); }
        public PageSize() { return this.MasterTable.Partition.Take; }

        public GotoInput: HTMLInputElement;

        public goToPage(page: string) {
            var pg = parseInt(page);
            this.MasterTable.Partition.setSkip(pg * this.MasterTable.Partition.Take, false);
        }

        public gotoPageClick(e: Reinforced.Lattice.ITemplateBoundEvent) {
            if (this.GotoInput) {
                var v: string = this.GotoInput.value;
                v = (parseInt(v) - 1).toString();
                this.goToPage(v);
            }
        }

        public navigateToPage(e: Reinforced.Lattice.ITemplateBoundEvent) {
            this.goToPage(e.EventArguments[0]);
        }

        public nextClick(e: Reinforced.Lattice.ITemplateBoundEvent) {
            if (this.MasterTable.Stats.CurrentPage() < this.MasterTable.Stats.Pages()) this.goToPage((this.MasterTable.Stats.CurrentPage() + 1).toString());
        }

        public previousClick(e: Reinforced.Lattice.ITemplateBoundEvent) {
            if (this.MasterTable.Stats.CurrentPage() > 0) this.goToPage((this.MasterTable.Stats.CurrentPage() - 1).toString());
        }

        private constructPagesElements() {
            var a: IPagesElement[] = [];
            var total: number = this.MasterTable.Stats.Pages();
            var cur: number = this.MasterTable.Stats.CurrentPage();
            var pdiff: number = this.Configuration.PagesToHideUnderPeriod;
            var totalKnown = this.MasterTable.Partition.isAmountFinite();

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
                        if (!totalKnown) {
                            a.push({ Page: 0, Period: true });
                        }
                    }
                    if (cur < total - 1) a.push({ Page: 0, Next: true });

                    if (this.Configuration.UseFirstLastPage && totalKnown) a.push({ Page: total - 1, Last: true });

                    var disFunction: () => any = function () { return this.Page + 1; }
                    for (var j: number = 0; j < a.length; j++) {
                        a[j].DisPage = disFunction;
                    }
                    this.Pages = a;
                } else {
                    this.NextArrow = totalKnown ? cur < total - 1 : true;
                    this.PrevArrow = cur > 0;
                }
            } else {
                this.Shown = false;
            }
        }

        public renderContent(p: Reinforced.Lattice.Templating.TemplateProcess): void {
            this.constructPagesElements();
            super.defaultRender(p);
        }

        public validateGotopage() {
            var v: string = this.GotoInput.value;
            var i: number = parseInt(v);
            var valid: boolean = this.MasterTable.Partition.isAmountFinite() ? (!isNaN(i) && (i > 0) && (i <= this.MasterTable.Stats.Pages())) : true;
            if (valid) {
                this.VisualStates.normalState();
            } else {
                this.VisualStates.changeState('invalid');
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
        }

        private onPartitionChanged(e: ITableEventArgs<Reinforced.Lattice.IPartitionChangeEventArgs>) {
            if (e.EventArgs.Take === e.EventArgs.PreviousTake && e.EventArgs.Skip === e.EventArgs.PreviousSkip) return;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        private onClientDataProcessing(e: ITableEventArgs<Reinforced.Lattice.IClientDataResults>) {
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        public subscribe(e: Reinforced.Lattice.Services.EventsService): void {
            e.PartitionChanged.subscribeAfter(this.onPartitionChanged.bind(this), 'paging');
            e.ClientDataProcessing.subscribeAfter(this.onClientDataProcessing.bind(this), 'paging');
        }
    }

    export interface IPagesElement {
        Prev?: boolean;
        Period?: boolean;
        ActivePage?: boolean;
        Page: number;
        First?: boolean;
        Last?: boolean;
        Next?: boolean;
        InActivePage?: boolean;
        DisPage?: () => string;
    }



    ComponentsContainer.registerComponent('Paging', PagingPlugin);
} 