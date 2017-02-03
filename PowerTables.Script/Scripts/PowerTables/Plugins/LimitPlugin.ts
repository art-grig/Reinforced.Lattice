
module PowerTables.Plugins.Limit {
    
    export class LimitPlugin extends PowerTables.Plugins.PluginBase<Plugins.Limit.ILimitClientConfiguration> {
        public SelectedValue: ILimitSize;
        private _limitSize = 0;
        public Sizes: ILimitSize[] = [];

        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        public changeLimitHandler(e: PowerTables.ITemplateBoundEvent) {
            var limit = parseInt(e.EventArguments[0]);
            if (isNaN(limit)) limit = 0;
            this.MasterTable.Partition.setTake(limit);
        }

        public changeLimit() {
            var limit = this.MasterTable.Partition.Take;
            var changed = this._limitSize !== limit;
            if (!changed) return;
            this._limitSize = limit;
            var labelPair = null;
            for (var i = 0; i < this.Sizes.length; i++) {
                labelPair = this.Sizes[i];
                if (labelPair.Value === limit) {
                    break;
                }
            }
            if (labelPair != null) {
                this.SelectedValue = labelPair;
                this.MasterTable.Renderer.Modifier.redrawPlugin(this);
            }
        }

        private onPartitionChange(e:ITableEventArgs<IPartitionChangeEventArgs>) {
            if (e.EventArgs.Take !== e.EventArgs.PreviousTake) {
                this.changeLimit();
            }
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            var def = null;
            for (var i = 0; i < this.Configuration.LimitValues.length; i++) {
                var a = <ILimitSize>{
                    Value: this.Configuration.LimitValues[i],
                    Label: this.Configuration.LimitLabels[i],
                    IsSeparator: this.Configuration.LimitLabels[i] === '-'
                };
                this.Sizes.push(a);
                if (a.Label === this.Configuration.DefaultValue) {
                    def = a;
                }
            }

            if (def) {
                this.SelectedValue = def;
                this._limitSize = def.Value;
            } else {
                this._limitSize = 0;
            }
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.PartitionChanged.subscribeAfter(this.onPartitionChange.bind(this),'limit');
        }
    }

    /**
     * Size entry for limit plugin
     */
    export interface ILimitSize {
        IsSeparator: boolean;
        Value: number;
        Label: string;
    }


    ComponentsContainer.registerComponent('Limit', LimitPlugin);
}