var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        var PagingPlugin = (function (_super) {
            __extends(PagingPlugin, _super);
            function PagingPlugin() {
                _super.apply(this, arguments);
                this._selectedPage = 0;
            }
            PagingPlugin.prototype.getCurrentPage = function () {
                return this._selectedPage;
            };
            PagingPlugin.prototype.getTotalPages = function () {
                return this._totalPages;
            };
            PagingPlugin.prototype.getPageSize = function () {
                return this._pageSize;
            };
            PagingPlugin.prototype.onFilterGathered = function (e) {
                this._pageSize = e.EventArgs.Query.Paging.PageSize;
            };
            PagingPlugin.prototype.onColumnsCreation = function () {
                if (this.Configuration.EnableClientPaging && !this.MasterTable.DataHolder.EnableClientTake) {
                    var limit = null;
                    try {
                        limit = this.MasterTable.InstanceManager.getPlugin('Limit');
                    }
                    catch (a) { }
                    if (limit != null)
                        throw new Error('Paging ang Limit plugins must both work locally or both remote. Please enable client limiting');
                }
            };
            PagingPlugin.prototype.onResponse = function (e) {
                this._selectedPage = e.EventArgs.Data.PageIndex;
                var tp = e.EventArgs.Data.ResultsCount / this._pageSize;
                if (tp !== parseInt(tp)) {
                    tp = parseInt(tp) + 1;
                }
                this._totalPages = tp;
                this.MasterTable.Renderer.redrawPlugin(this);
            };
            PagingPlugin.prototype.onClientDataProcessing = function (e) {
                var tp = e.EventArgs.Filtered.length / this._pageSize;
                if (tp !== parseInt(tp)) {
                    tp = parseInt(tp) + 1;
                }
                if (tp < this._selectedPage) {
                    this._selectedPage = 0;
                }
                this._totalPages = tp;
                this.MasterTable.Renderer.redrawPlugin(this);
            };
            PagingPlugin.prototype.goToPage = function (page) {
                this._selectedPage = parseInt(page);
                this.MasterTable.Controller.reload();
            };
            PagingPlugin.prototype.gotoPageClick = function (e) {
                if (this.GotoInput) {
                    var v = this.GotoInput.value;
                    v = (parseInt(v) - 1).toString();
                    this.goToPage(v);
                }
            };
            PagingPlugin.prototype.navigateToPage = function (e) {
                this.goToPage(e.EventArguments[0]);
            };
            PagingPlugin.prototype.nextClick = function (e) {
                if (this._selectedPage < this._totalPages)
                    this.goToPage((this._selectedPage + 1).toString());
            };
            PagingPlugin.prototype.previousClick = function (e) {
                if (this._selectedPage > 0)
                    this.goToPage((this._selectedPage - 1).toString());
            };
            PagingPlugin.prototype.constructPagesElements = function () {
                var a = [];
                var total = this._totalPages;
                var cur = this._selectedPage;
                var pdiff = this.Configuration.PagesToHideUnderPeriod;
                if (total > 1) {
                    this.Shown = true;
                    if (!this.Configuration.ArrowsMode) {
                        if (this.Configuration.UseFirstLastPage)
                            a.push({ Page: 0, First: true });
                        if (cur > 0)
                            a.push({ Page: 0, Prev: true });
                        if (this.Configuration.UsePeriods) {
                            if (cur - 1 >= pdiff)
                                a.push({ Page: 0, Period: true });
                            if (cur - 1 > 0)
                                a.push({ Page: cur - 1, InActivePage: true });
                            a.push({ Page: cur, ActivePage: true });
                            if (cur + 1 < total)
                                a.push({ Page: cur + 1, InActivePage: true });
                            if (total - (cur + 1) >= pdiff)
                                a.push({ Page: 0, Period: true });
                        }
                        else {
                            for (var i = 0; i < total; i++) {
                                if (cur === i) {
                                    a.push({ Page: i, ActivePage: true });
                                }
                                else {
                                    a.push({ Page: i, InActivePage: true });
                                }
                            }
                        }
                        if (cur < total - 1)
                            a.push({ Page: 0, Next: true });
                        if (this.Configuration.UseFirstLastPage)
                            a.push({ Page: total - 1, Last: true });
                        var disFunction = function () { return this.Page + 1; };
                        for (var j = 0; j < a.length; j++) {
                            a[j].DisPage = disFunction;
                        }
                        this.Pages = a;
                    }
                    else {
                        this.NextArrow = cur < total - 1;
                        this.PrevArrow = cur > 0;
                    }
                }
                else {
                    this.Shown = false;
                }
            };
            PagingPlugin.prototype.renderContent = function (templatesProvider) {
                this.constructPagesElements();
                return templatesProvider.getCachedTemplate('paging')(this);
            };
            PagingPlugin.prototype.validateGotopage = function () {
                var v = this.GotoInput.value;
                var i = parseInt(v);
                var valid = !isNaN(i) && (i > 0) && (i <= this._totalPages);
                if (valid) {
                    this.GotoPanel.classList.remove('has-error');
                    this.GotoBtn.removeAttribute('disabled');
                }
                else {
                    this.GotoPanel.classList.add('has-error');
                    this.GotoBtn.setAttribute('disabled', 'disabled');
                }
            };
            PagingPlugin.prototype.modifyQuery = function (query, scope) {
                if (this.Configuration.EnableClientPaging && scope === PowerTables.QueryScope.Client) {
                    query.Paging.PageIndex = this._selectedPage;
                }
                if ((!this.Configuration.EnableClientPaging) && scope !== PowerTables.QueryScope.Client) {
                    query.Paging.PageIndex = this._selectedPage;
                }
            };
            PagingPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                if (!this.Configuration.EnableClientPaging) {
                    this.MasterTable.Events.AfterQueryGathering.subscribe(this.onFilterGathered.bind(this), 'paging');
                }
                else {
                    this.MasterTable.Events.AfterClientQueryGathering.subscribe(this.onFilterGathered.bind(this), 'paging');
                }
                if (!this.Configuration.EnableClientPaging) {
                    this.MasterTable.Events.DataReceived.subscribe(this.onResponse.bind(this), 'paging');
                }
                else {
                    this.MasterTable.Events.AfterClientDataProcessing.subscribe(this.onClientDataProcessing.bind(this), 'paging');
                }
                this.MasterTable.Events.ColumnsCreation.subscribe(this.onColumnsCreation.bind(this), 'paging');
                if (this.Configuration.EnableClientPaging) {
                    this.MasterTable.DataHolder.EnableClientSkip = true;
                }
            };
            return PagingPlugin;
        })(Plugins.FilterBase);
        Plugins.PagingPlugin = PagingPlugin;
        PowerTables.ComponentsContainer.registerComponent('Paging', PagingPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=PagingPlugin.js.map