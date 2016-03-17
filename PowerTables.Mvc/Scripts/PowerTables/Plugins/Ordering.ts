module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import OrderableConfiguration = PowerTables.Plugins.Ordering.IOrderableConfiguration;

    export interface IOrderingModel {
        Type: Ordering;
        Title: string;
        IsAscending: () => boolean;
        IsDescending: () => boolean;
        IsNeutral: () => boolean;
    }
    export class OrderingPlugin
        extends PluginBase<any>
        implements IQueryPartProvider {

        protected RenderingTemplate: HandlebarsTemplateDelegate;
        private _cellsOrderings: { [key: string]: Ordering } = {};

        constructor() {
            super(null);
            this.RenderingTemplate = Handlebars.compile($('#pt-ordering').html());
        }

        init(table: PowerTable, configuration: PluginConfiguration): void {
            super.init(table, configuration);
            this.MasterTable.Events.AfterColumnHeaderRender.subscribe(this.onHeaderRender.bind(this), 'ordering');
        }

        private onHeaderRender(c: IColumn) {
            if (!c.Configuration.CellPluginsConfiguration['Ordering']) return;
            var oc: OrderableConfiguration = <any>(c.Configuration.CellPluginsConfiguration['Ordering']);
            this._cellsOrderings[c.RawName] = oc.DefaultOrdering;

            this.updateCellOrdering(c);
            c.HeaderElement.click((e) => this.changeOrdering(c));
        }

        protected changeOrdering(c: IColumn) {
            var currentOrdering = this._cellsOrderings[c.RawName];
            if (currentOrdering === Ordering.Neutral)
                this._cellsOrderings[c.RawName] = Ordering.Ascending;
            if (currentOrdering === Ordering.Ascending)
                this._cellsOrderings[c.RawName] = Ordering.Descending;
            if (currentOrdering === Ordering.Descending)
                this._cellsOrderings[c.RawName] = Ordering.Neutral;
            this.updateCellOrdering(c);
            this.MasterTable.reload();
        }
        protected updateCellOrdering(c: IColumn) {
            var cell = c.HeaderElement;
            cell.css('cursor', 'pointer');
            cell.empty();
            var ordering = this._cellsOrderings[c.RawName];
            cell.html(this.RenderingTemplate(this.createOrderingModel(ordering, c)));
        }
        private createOrderingModel(sortType: Ordering, c: IColumn): IOrderingModel {
            return {
                Title: c.Configuration.Title,
                Type: sortType,
                IsAscending() {
                    return this.Type === Ordering.Ascending;
                },
                IsDescending() {
                    return this.Type === Ordering.Descending;
                },
                IsNeutral() {
                    return this.Type === Ordering.Neutral;
                }
            }
        }

        IsToolbarPlugin: boolean = false;
        PluginId: string = 'Ordering';
        IsRenderable: boolean = false;
        IsQueryModifier: boolean = true;

        modifyQuery(query: IQuery): void {
            query.Orderings = this._cellsOrderings;
        }
    }

    ComponentsContainer.registerComponent('Ordering', OrderingPlugin);
} 