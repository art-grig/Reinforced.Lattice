var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var PagingPlugin = (function (_super) {
        __extends(PagingPlugin, _super);
        function PagingPlugin() {
            _super.call(this, 'pt-plugin-pager');
            this._firstDraw = true;
            this.IsToolbarPlugin = false;
            this.IsQueryModifier = true;
            this.PluginId = 'Paging';
            this.IsRenderable = true;
        }
        PagingPlugin.prototype.init = function (table, configuration) {
            this.Configuration = configuration.Configuration;
            this._masterTable = table;
            table.Events.AfterFilterGathering.subscribe(this.onFilterGathered.bind(this), 'paging');
            table.Events.ResponseDrawing.subscribe(this.onResponse.bind(this), 'paging');
        };
        PagingPlugin.prototype.onFilterGathered = function (query) {
            this._pageSize = query.Paging.PageSize;
        };
        PagingPlugin.prototype.onResponse = function (response) {
            this._selectedPage = response.PageIndex;
            var tp = response.ResultsCount / this._pageSize;
            if (tp !== parseInt(tp)) {
                tp = parseInt(tp) + 1;
            }
            this._totalPages = tp;
            var html = this.render();
            this._pagerContainer.html(html);
            this.findElements();
        };
        PagingPlugin.prototype.modifyQuery = function (query) {
            query.Paging.PageIndex = this._selectedPage;
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
        PagingPlugin.prototype.subscribeEvents = function (parentElement) {
            this._pagerContainer = parentElement;
            this.findElements();
            var _self = this;
            this._pagerContainer.delegate('[data-action="prev"]', 'click', function (e) { return _self.previousClick(); });
            this._pagerContainer.delegate('[data-action="next"]', 'click', function (e) { return _self.nextClick(); });
            this._pagerContainer.delegate('[data-action="page"]', 'click', function (e) {
                return _self.pageClick($(this).data('page'));
            });
            this._pagerContainer.delegate('[data-action="navg"]', 'click', function (e) { return _self.goToPageClick(); });
        };
        PagingPlugin.prototype.findElements = function () {
            var _self = this;
            this._gotoPage = this._pagerContainer.find('input[data-action="pageInput"]');
            this._gotoPanel = this._pagerContainer.find('._gotoPanel');
            this._gotoPageBtn = this._pagerContainer.find('[data-action="navg"]');
            this._gotoPage.keyup(function (e) { return _self.validateGotopage(); });
        };
        PagingPlugin.prototype.pageClick = function (page) {
            this._selectedPage = parseInt(page);
            this._masterTable.reload();
        };
        PagingPlugin.prototype.nextClick = function () {
            if (this._selectedPage < this._totalPages)
                this.pageClick((this._selectedPage + 1).toString());
        };
        PagingPlugin.prototype.previousClick = function () {
            if (this._selectedPage > 0)
                this.pageClick((this._selectedPage - 1).toString());
        };
        PagingPlugin.prototype.goToPageClick = function () {
            if (this._gotoPage) {
                var v = this._gotoPage.val();
                v = (parseInt(v) - 1).toString();
                this.pageClick(v);
            }
        };
        PagingPlugin.prototype.validateGotopage = function () {
            var v = this._gotoPage.val();
            var i = parseInt(v);
            var valid = !isNaN(i) && (i > 0) && (i <= this._totalPages);
            if (valid) {
                this._gotoPanel.removeClass('has-error');
                this._gotoPageBtn.removeAttr('disabled');
            }
            else {
                this._gotoPanel.addClass('has-error');
                this._gotoPageBtn.attr('disabled', 'disabled');
            }
        };
        PagingPlugin.prototype.render = function (context) {
            this.constructPagesElements();
            return _super.prototype.render.call(this, context);
        };
        return PagingPlugin;
    })(PowerTables.RenderableComponent);
    PowerTables.PagingPlugin = PagingPlugin;
    PowerTables.ComponentsContainer.registerComponent('Paging', PagingPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Paging.js.map