module PowerTables.Plugins.MouseSelect {
    export class MouseSelectPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.MouseSelect.IMouseSelectUiConfig> {
        init(masterTable: IMasterTable): void {
            super.init(masterTable);
        }
        private originalX: number;
        private originalY: number;
        private selectPane: HTMLElement;
        private _isSelecting: boolean;

        private selectStart(x: number, y: number) {
            if (this._isSelecting) {
                this.selectEnd();
                return;
            }

            this.selectPane = this.MasterTable.Renderer.Modifier
                .createElement(this.MasterTable.Renderer.renderToString(this.RawConfig.TemplateId,null));
            this.selectPane.style.left = x + 'px';
            this.selectPane.style.top = y + 'px';
            this.selectPane.style.width = '0';
            this.selectPane.style.height = '0';
            this.selectPane.style.position = 'absolute';
            this.selectPane.style.zIndex = '9999';
            this.selectPane.style.pointerEvents = 'none';

            this.originalX = x;
            this.originalY = y;
            document.body.appendChild(this.selectPane);
            this._isSelecting = true;
        }

        private move(x: number, y: number) {
            if (!this._isSelecting) return;
            
            var cx = (x <= this.originalX) ? x : this.originalX;
            var cy = (y <= this.originalY) ? y : this.originalY;

            var nx = (x >= this.originalX) ? x : this.originalX;
            var ny = (y >= this.originalY) ? y : this.originalY;

            this.selectPane.style.left = cx + 'px';
            this.selectPane.style.top = cy + 'px';
            this.selectPane.style.width = (nx - cx) + 'px';
            this.selectPane.style.height = (ny - cy) + 'px';

            //this.originalX = cx;
            //this.originalY = cy;
        }

        private selectEnd() {
            if (!this._isSelecting) return;
            document.body.removeChild(this.selectPane);
            this._isSelecting = false;
        }

        private _isAwaitingSelection: boolean = false;
        afterDrawn: (e: ITableEventArgs<any>) => void = (a) => {
            PowerTables.Services.EventsDelegatorService.addHandler(this.MasterTable.Renderer.RootElement, "mousedown", (e: MouseEvent) => {
                this._isAwaitingSelection = true;
                
                setTimeout(() => {
                        if (!this._isAwaitingSelection) return;
                    if (!this._isSelecting) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                    this.selectStart(e.pageX, e.pageY);
                },
                    10);
                return true;
            });
            PowerTables.Services.EventsDelegatorService.addHandler(this.MasterTable.Renderer.RootElement, "mousemove", (e: MouseEvent) => {
                if (this._isSelecting) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                this.move(e.pageX, e.pageY);
                return true;
            });

            PowerTables.Services.EventsDelegatorService.addHandler(document.documentElement, "mouseup", (e: MouseEvent) => {
                this._isAwaitingSelection = false;
                this.selectEnd();
                if (this._isSelecting) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                return true;
            });
        }
    }
    ComponentsContainer.registerComponent('MouseSelect', MouseSelectPlugin);
}