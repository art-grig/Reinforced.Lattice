module PowerTables.Plugins {
    export class LoadingOverlapPlugin extends PluginBase<PowerTables.Plugins.LoadingOverlap.ILoadingOverlapUiConfig>  {
        private _overlappingElement: HTMLElement[][] = [];
        private _overlapLayer: HTMLElement[][] = [];
        private _isOverlapped:boolean = false;
        
        private overlapAll() {
            if (this._isOverlapped) return;
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
            this._isOverlapped = true;
        }

        private createOverlap(efor: HTMLElement, templateId: string): HTMLElement {
            var element = this.MasterTable.Renderer.Modifier.createElement(this.MasterTable.Renderer.getCachedTemplate(templateId)(null));

            var mezx = null;
            if ((<any>this._overlappingElement).currentStyle) mezx = (<any>this._overlappingElement).currentStyle.zIndex;
            else if (window.getComputedStyle) {
                mezx = window.getComputedStyle(element, null).zIndex;
            }
            element.style.position = "relative";
            element.style.display = "block";
            element.style.zIndex = (parseInt(mezx) + 1).toString();
            //document.body.appendChild(element); //todo switch
            efor.appendChild(element);
            this.updateCoords(element, efor);
            return element;
        }

        private updateCoords(overlapLayer: HTMLElement, overlapElement: HTMLElement) {
            overlapLayer.style.display = "none";
            var eo = overlapElement.getBoundingClientRect();
            //overlapLayer.style.left = eo.left + 'px';
            //overlapLayer.style.top = overlapElement.offsetTop + 'px';
            
            overlapLayer.style.left = '0px';
            overlapLayer.style.top = '0px';
            overlapLayer.style.width = eo.width + 'px';
            overlapLayer.style.height = eo.height + 'px';
            overlapLayer.style.display = "block";
        }


        private updateCoordsAll() {
            for (var j = 0; j < this._overlapLayer.length; j++) {
                for (var l = 0; l < this._overlapLayer[j].length; l++) {
                    this.updateCoords(this._overlapLayer[j][l], this._overlappingElement[j][l]);
                }
            }
        }

        private deoverlap() {
            if (!this._isOverlapped) return;
            for (var j = 0; j < this._overlapLayer.length; j++) {
                for (var l = 0; l < this._overlapLayer[j].length; l++) {
                    this._overlappingElement[j][l].removeChild(this._overlapLayer[j][l]);
                }
            }
            this._overlapLayer = [];
            this._overlappingElement = [];
            this._isOverlapped = false;
        }

        private onBeforeLoading(e: ITableEventArgs<ILoadingEventArgs>) {
            this.overlapAll();
        }

        public afterDrawn: (e: ITableEventArgs<any>) => void = e=> {
            this.MasterTable.Events.BeforeLoading.subscribe((e) => this.onBeforeLoading(e), 'overlapLoading');
            this.MasterTable.Events.AfterDataRendered.subscribe(() => this.deoverlap(), 'overlapLoading');
            this.MasterTable.Events.AfterLoading.subscribe(() => this.deoverlap(), 'overlapLoading');
            window.addEventListener('resize', this.updateCoordsAll.bind(this));
        }
    }
    ComponentsContainer.registerComponent('LoadingOverlap', LoadingOverlapPlugin);
} 