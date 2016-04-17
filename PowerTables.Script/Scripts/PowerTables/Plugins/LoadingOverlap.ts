module PowerTables.Plugins {
    import LoadingOverlapUiConfig = PowerTables.Plugins.LoadingOverlap.ILoadingOverlapUiConfig;

    export class LoadingOverlapPlugin extends PluginBase<LoadingOverlapUiConfig>  {
        private _overlappingElement: HTMLElement;
        private _overlapLayer: HTMLElement;

        private overlap() {
            if (this._overlapLayer) return;
            this._overlapLayer = this.MasterTable.Renderer.Modifier.createElement(this.defaultRender(this.MasterTable.Renderer));
            var mezx = null;
            if ((<any>this._overlappingElement).currentStyle) mezx = (<any>this._overlappingElement).currentStyle.zIndex;
            else if (window.getComputedStyle) {
                mezx = window.getComputedStyle(this._overlappingElement, null).zIndex;
            }
            this._overlapLayer.style.position = "absolute";
            this._overlapLayer.style.zIndex = (parseInt(mezx) + 1).toString();
            document.body.appendChild(this._overlapLayer);
            this.updateCoords();
        }

        private updateCoords() {
            if (!this._overlapLayer) return;
            var eo = this._overlappingElement.getBoundingClientRect();
            this._overlapLayer.style.left = eo.left + 'px';
            this._overlapLayer.style.top = eo.top + 'px';
            this._overlapLayer.style.width = eo.width + 'px';
            this._overlapLayer.style.height = eo.height + 'px';
        }

        private deoverlap() {
            if (!this._overlapLayer) return;
            document.body.removeChild(this._overlapLayer);
            delete this._overlapLayer;
        }

        private onBeforeLoading(e: ITableEventArgs<ILoadingEventArgs>) {
            if (e.EventArgs.Request.Command !== 'query') return;
            this.overlap();
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = e=> {
            if (this.Configuration.OverlapMode === LoadingOverlap.OverlapMode.All) {
                this._overlappingElement = this.MasterTable.Renderer.RootElement;
            } else {
                this._overlappingElement = this.MasterTable.Renderer.BodyElement;
            }
            this.MasterTable.Events.BeforeLoading.subscribe((e) => this.onBeforeLoading(e), 'overlapLoading');
            
            this.MasterTable.Events.AfterDataRendered.subscribe(() => this.deoverlap(), 'overlapLoading');
            
            window.addEventListener('resize', this.updateCoords.bind(this));
        }
    }
    ComponentsContainer.registerComponent('LoadingOverlap', LoadingOverlapPlugin);
} 