module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import HideoutClientConfiguration = PowerTables.Plugins.Hideout.IHideoutClientConfiguration;
    import HideoutCellConfiguration = PowerTables.Plugins.Hideout.IHideoutCellConfiguration;

    export interface IColumnState {
        Visible: boolean;
        RawName: string;
        Name: string;
    }
    export class HideoutPlugin
        extends PluginBase<HideoutClientConfiguration>
        implements IQueryPartProvider {

        private _element: JQuery;
        private _parentElement: JQuery;
        private _visibleColumn: HandlebarsTemplateDelegate;
        private _hiddenColumn: HandlebarsTemplateDelegate;

        public ColumnsStates: IColumnState[] = [];

        constructor() {
            super('pt-hideout');
            this._visibleColumn = Handlebars.compile($('#pt-hideout-visibleColumn').html());
            this._hiddenColumn = Handlebars.compile($('#pt-hideout-hiddenColumn').html());
        }

        init(table: PowerTable, configuration: PluginConfiguration): void {
            super.init(table, configuration);
            if (!this.Configuration || !this.Configuration.ShowMenu) {
                this.IsRenderable = false;
            } else {
                this.IsRenderable = true;
                this.constructColumnStates();
            }
        }

        subscribe(e: EventsManager): void {
            e.AfterColumnHeaderRender.subscribe(this.onHeaderDrawn.bind(this), 'hideout');
            e.AfterFilterRender.subscribe(this.onFilterDrawn.bind(this), 'hideout');
            e.AfterCellDraw.subscribe(this.onCellDrawn.bind(this), 'hideout');
        }

        constructColumnStates() {
            var cols = this.MasterTable.Configuration.Columns;
            for (var ck in cols) {
                if (cols.hasOwnProperty(ck)) {
                    var col = cols[ck];
                    if (this.Configuration.HidebleColumnsNames.indexOf(col.RawColumnName) === -1) continue;
                    var hc: HideoutCellConfiguration = col.CellPluginsConfiguration['Hideout'];
                    this.ColumnsStates.push({
                        RawName: col.RawColumnName,
                        Name: col.Title,
                        Visible: !hc || !hc.Hidden
                    });
                }
            }
        }
        onHeaderDrawn(column: IColumn) {
            if (!this.isColumnInstanceVisible(column)) {
                column.HeaderElement.hide();
            }
        }
        onFilterDrawn(column: IColumn) {
            if (!this.isColumnInstanceVisible(column)) {
                column.Filter.Element.hide();
            }
        }

        onCellDrawn(c: ICell) {
            if (!this.isColumnInstanceVisible(c.Column)) {
                c.Element.hide();
            }
        }

        public isColumnVisible(columnName: string): boolean {
            return this.isColumnInstanceVisible(this.MasterTable.Columns[columnName]);
        }

        public isColumnInstanceVisible(col: IColumn): boolean {
            if (!col) return true;
            var hc: HideoutCellConfiguration = col.Configuration.CellPluginsConfiguration['Hideout'];
            return !hc || !hc.Hidden;
        }

        public hideColumnByName(rawColname: string) {
            this.hideColumnInstance(this.MasterTable.Columns[rawColname]);
        }

        public hideColumnInstance(c: IColumn) {
            if (!c) return;
            c.HeaderElement.hide();
            c.Filter.Element.hide();
            for (var i = 0; i < c.Elements.length; i++) {
                c.Elements[i].hide();
            }
            if (!c.Configuration.CellPluginsConfiguration['Hideout']) {
                c.Configuration.CellPluginsConfiguration['Hideout'] = {};
            }
            c.Configuration.CellPluginsConfiguration['Hideout'].Hidden = true;
            if (this.Configuration.ReloadTableOnChangeHidden) this.MasterTable.reload();
        }

        public showColumnByName(rawColname: string) {
            this.showColumnInstance(this.MasterTable.Columns[rawColname]);
        }

        public showColumnInstance(c: IColumn) {
            if (!c) return;
            c.HeaderElement.show();
            c.Filter.Element.show();
            for (var i = 0; i < c.Elements.length; i++) {
                c.Elements[i].show();
            }
            if (!c.Configuration.CellPluginsConfiguration['Hideout']) {
                c.Configuration.CellPluginsConfiguration['Hideout'] = {};
            }
            c.Configuration.CellPluginsConfiguration['Hideout'].Hidden = false;
            if (this.Configuration.ReloadTableOnChangeHidden) this.MasterTable.reload();
        }

        public toggleColumnByName(columnName: string): boolean {
            if (this.isColumnVisible(columnName)) {
                this.hideColumnByName(columnName);
                return false;
            } else {
                this.showColumnByName(columnName);
                return true;
            }
        }

        subscribeEvents(parentElement: JQuery): void {
            var _self = this;
            parentElement.delegate('li[data-showhide]', 'click', function (e) {
                var li = $(this);
                var name = li.data('showhide');
                var shown = _self.toggleColumnByName(name);
                var colName = _self.MasterTable.Columns[name].Configuration.Title;
                if (!shown) {
                    li.html(_self._hiddenColumn({ Name: colName }));
                } else {
                    li.html(_self._visibleColumn({ Name: colName }));
                }
                e.stopPropagation();// to disable menu hide
            });
        }

        IsToolbarPlugin: boolean = true;
        PluginId: string = 'Hideout';
        IsRenderable: boolean = true;
        IsQueryModifier: boolean = true;

        modifyQuery(query: IQuery): void {
            var hidden = '';
            var shown = '';
            var cols = this.MasterTable.Columns;
            for (var ck in cols) {
                if (cols.hasOwnProperty(ck)) {
                    var col = cols[ck];
                    if (!this.isColumnInstanceVisible(col)) {
                        hidden = hidden + ',' + col.RawName;
                    } else {
                        shown = shown + ',' + col.RawName;
                    }
                }
            }
            query.AdditionalData['HideoutHidden'] = hidden;
            query.AdditionalData['HideoutShown'] = shown;
        }

        
    }

    ComponentsContainer.registerComponent('Hideout', HideoutPlugin);
}  