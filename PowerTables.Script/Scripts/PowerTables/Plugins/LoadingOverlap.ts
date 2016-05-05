module PowerTables.Plugins {
    import LoadingOverlapUiConfig = PowerTables.Plugins.LoadingOverlap.ILoadingOverlapUiConfig;

    export class LoadingOverlapPlugin extends PluginBase<LoadingOverlapUiConfig>  {
        private _overlappingElement: HTMLElement[][] = [];
        private _overlapLayer: HTMLElement[][] = [];

        private overlapAll() {
            this._overlapLayer = [];
            this._overlappingElement = [];
            for (var k in this.Configuration.Overlaps) {
                if (this.Configuration.Overlaps.hasOwnProperty(k)) {
                    if (k === '$All') this._overlappingElement.push([this.MasterTable.Renderer.RootElement]);
                    else if (k === '$BodyOnly') this._overlappingElement.push([this.MasterTable.Renderer.BodyElement]);
                    else {
                        var elements = document.querySelectorAll(k);
                        var elems = [];
                        var overlappers = [];
                        for (var i = 0; i < elements.length; i++) {
                            elems.push(elements.item(i));
                            overlappers.push(this.createOverlap(<HTMLElement>elements.item(i), this.Configuration.Overlaps[k]));
                        }
                        this._overlappingElement.push(elems);
                        this._overlapLayer.push(overlappers);
                    }
                }
            }
        }

        private createOverlap(efor: HTMLElement, templateId: string): HTMLElement {
            var element = this.MasterTable.Renderer.Modifier.createElement(this.MasterTable.Renderer.getCachedTemplate(templateId)(null));

            var mezx = null;
            if ((<any>this._overlappingElement).currentStyle) mezx = (<any>this._overlappingElement).currentStyle.zIndex;
            else if (window.getComputedStyle) {
                mezx = window.getComputedStyle(element, null).zIndex;
            }
            element.style.position = "absolute";
            element.style.zIndex = (parseInt(mezx) + 1).toString();
            document.body.appendChild(element);
            this.updateCoords(element, efor);
            return element;
        }

        private updateCoords(overlapLayer: HTMLElement, overlapElement: HTMLElement) {
            var eo = overlapElement.getBoundingClientRect();
            overlapLayer.style.left = eo.left + 'px';
            overlapLayer.style.top = eo.top + 'px';
            overlapLayer.style.width = eo.width + 'px';
            overlapLayer.style.height = eo.height + 'px';
        }


        private updateCoordsAll() {
            for (var j = 0; j < this._overlapLayer.length; j++) {
                for (var l = 0; l < this._overlapLayer[j].length; l++) {
                    this.updateCoords(this._overlapLayer[j][l], this._overlappingElement[j][l]);
                }
            }
        }

        private deoverlap() {
            for (var j = 0; j < this._overlapLayer.length; j++) {
                for (var l = 0; l < this._overlapLayer[j].length; l++) {
                    document.body.removeChild(this._overlapLayer[j][l]);
                }
            }
            this._overlapLayer = [];
            this._overlappingElement = [];
        }

        private onBeforeLoading(e: ITableEventArgs<ILoadingEventArgs>) {
            if (e.EventArgs.Request.Command !== 'query') return;
            this.overlapAll();
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = e=> {
            this.MasterTable.Events.BeforeLoading.subscribe((e) => this.onBeforeLoading(e), 'overlapLoading');
            this.MasterTable.Events.AfterDataRendered.subscribe(() => this.deoverlap(), 'overlapLoading');
            window.addEventListener('resize', this.updateCoordsAll.bind(this));
        }
    }
    ComponentsContainer.registerComponent('LoadingOverlap', LoadingOverlapPlugin);
} 