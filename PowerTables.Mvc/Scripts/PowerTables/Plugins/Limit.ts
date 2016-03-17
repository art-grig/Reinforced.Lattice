module PowerTables {
    import PluginConfiguration = PowerTables.Configuration.Json.IPluginConfiguration;
    import LimitClientConfiguration = PowerTables.Plugins.Limit.ILimitClientConfiguration;

    export class LimitPlugin
        extends PluginBase<LimitClientConfiguration>
        implements IQueryPartProvider {

        private _pageSize: number;
        private _selectedLabelElement: JQuery;

        constructor() {
            super('pt-plugin-limit');
        }

        init(table: PowerTable, configuration: PluginConfiguration): void {
            super.init(table, configuration);
            var conf = this.Configuration;
            var s = [];
            var def = null;
            for (var i = 0; i < conf.LimitValues.length; i++) {
                var a = {
                    Value: conf.LimitValues[i],
                    Label: conf.LimitLabels[i],
                    Separator: conf.LimitLabels[i] === '-'
                };
                s.push(a);
                if (a.Label === conf.DefaultValue) {
                    def = a;
                }
            }
            this.Sizes = s;
            if (def) {
                this.DefaultLabel = def.Label;
                this.DefaultValue = def.Value;
                this._pageSize = def.Value;
            } else {
                this._pageSize = 0;
            }
            table.Events.AfterFilterGathering.subscribe(this.addLimits.bind(this), 'limit');
        }

        private addLimits(query: IQuery) {
            query.Paging.PageSize = this._pageSize;
        }

        IsToolbarPlugin: boolean = true;
        PluginId: string = 'Limit';
        Sizes: any[];
        DefaultLabel: string;
        DefaultValue: string;

        private handleLimitSelect(item: HTMLElement) {
            var itm = $(item);
            var value = itm.data('size');
            var changed = this._pageSize !== value;
            if (!changed) return;

            this._pageSize = value;
            var labelPair = null;
            for (var i = 0; i < this.Sizes.length; i++) {
                labelPair = this.Sizes[i];
                if (labelPair.Value === value) {
                    break;
                }
            }
            this._selectedLabelElement.text(labelPair.Label);

            if (this.Configuration.ReloadTableOnLimitChange) this.MasterTable.reload();
        }

        subscribeEvents(parentElement: JQuery): void {
            var _self = this;
            parentElement.find('._limitSelect').click(function (e) {
                _self.handleLimitSelect(this);
            });
            this._selectedLabelElement = parentElement.find('._selectedLabel');
        }

        IsQueryModifier: boolean = true;
        IsRenderable: boolean = true;
        modifyQuery(query: IQuery): void {
            query.Paging.PageSize = this._pageSize;
        }
    }

    ComponentsContainer.registerComponent('Limit', LimitPlugin);
}  