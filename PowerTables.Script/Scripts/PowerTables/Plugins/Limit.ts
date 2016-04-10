module PowerTables.Plugins {
    import LimitClientConfiguration = PowerTables.Plugins.Limit.ILimitClientConfiguration;
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;

    export class LimitPlugin extends FilterBase<LimitClientConfiguration> implements ILimitPlugin {


        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('limit')(this);
        }

        public changeLimitHandler(e: TemplateBoundEvent<ILimitPlugin>) {
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
            if (labelPair != null) this.SelectedValue = labelPair.Label;
            this.MasterTable.Renderer.redrawPlugin(this);
            if (this.Configuration.ReloadTableOnLimitChange) this.MasterTable.Controller.reload();
        }


        public SelectedValue: string;
        private _limitSize: number = 0;

        public Sizes: ILimitSize[] = [];

        modifyQuery(query: IQuery, scope: QueryScope): void {
            var client = this.Configuration.EnableClientLimiting;

            if (client && (scope === QueryScope.Client || scope === QueryScope.Transboundary)) {
                query.Paging.PageSize = this._limitSize;
            }

            if (!client && (scope === QueryScope.Server || scope === QueryScope.Transboundary)) {
                query.Paging.PageSize = this._limitSize;
            }
        }

        init(masterTable: IMasterTable): void {
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
                this.SelectedValue = def.Label;
                this._limitSize = def.Value;
            } else {
                this._limitSize = 0;
            }

            if (this.Configuration.EnableClientLimiting) {
                this.MasterTable.DataHolder.EnableClientTake = true;
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

    /**
     * Limit plugin interface
     */
    export interface ILimitPlugin {
        /**
         * Changeable. Will refresh after plugin redraw
         */
        SelectedValue: string;

        /**
         * Changeable. Will refresh after plugin redraw
         */
        Sizes: ILimitSize[];

        /**
         * Changes limit settings and updates UI
         * 
         * @param limit Selected limit
         * @returns {} 
         */
        changeLimit(limit: number);
    }
    ComponentsContainer.registerComponent('Limit', LimitPlugin);
} 