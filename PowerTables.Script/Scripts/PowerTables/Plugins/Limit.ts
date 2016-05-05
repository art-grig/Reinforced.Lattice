module PowerTables.Plugins {
    export class LimitPlugin extends FilterBase<Plugins.Limit.ILimitClientConfiguration> {
        public SelectedValue: ILimitSize;
        private _limitSize = 0;
        public Sizes: ILimitSize[] = [];

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
        }

        public changeLimitHandler(e: Rendering.ITemplateBoundEvent) {
            var limit = parseInt(e.EventArguments[0]);
            if (isNaN(limit)) limit = 0;
            this.changeLimit(limit);
        }

        public changeLimit(limit: number) {
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
            if (labelPair != null) this.SelectedValue = labelPair;
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
            if (this.Configuration.ReloadTableOnLimitChange) this.MasterTable.Controller.reload();
        }

        public modifyQuery(query: IQuery, scope: QueryScope): void {
            var client = this.Configuration.EnableClientLimiting;

            if (client && (scope === QueryScope.Client || scope === QueryScope.Transboundary)) {
                query.Paging.PageSize = this._limitSize;
            }

            if (!client && (scope === QueryScope.Server || scope === QueryScope.Transboundary)) {
                query.Paging.PageSize = this._limitSize;
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

            if (this.Configuration.EnableClientLimiting) {
                this.MasterTable.DataHolder.EnableClientTake = true;
            }

            this.MasterTable.Events.ColumnsCreation.subscribe(this.onColumnsCreation.bind(this), 'paging');

        }

        private onColumnsCreation() {
            if (this.Configuration.EnableClientLimiting && !this.MasterTable.DataHolder.EnableClientSkip) {
                var paging = null;
                try {
                    paging = this.MasterTable.InstanceManager.getPlugin('Paging');
                } catch (a) {
                }
                if (paging != null)
                    throw new Error('Limit ang paging plugin must both work locally or both remote. Please enable client paging');
            }
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