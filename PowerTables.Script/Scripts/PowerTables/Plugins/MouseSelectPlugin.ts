module PowerTables.Plugins.MouseSelect {
    export class MouseSelectPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.MouseSelect.IMouseSelectUiConfig> {
        init(masterTable: IMasterTable): void {
            super.init(masterTable);
        }
        private _originalX: number;
        private _originalY: number;
        private _selectPane: HTMLElement;
        private _isSelecting: boolean;

        private selectStart(x: number, y: number) {
            if (this._isSelecting) {
                this.selectEnd();
                return;
            }

            this._selectPane = this.MasterTable.Renderer.Modifier
                .createElement(this.MasterTable.Renderer.getCachedTemplate(this.RawConfig.TemplateId)(null));
            this._selectPane.style.left = x + 'px';
            this._selectPane.style.top = y + 'px';
            this._selectPane.style.width = '0';
            this._selectPane.style.height = '0';
            this._selectPane.style.position = 'absolute';
            this._selectPane.style.zIndex = '9999';
            this._selectPane.style.pointerEvents = 'none';

            this._originalX = x;
            this._originalY = y;
            document.body.appendChild(this._selectPane);
            this._isSelecting = true;
        }

        private move(x: number, y: number) {
            if (!this._isSelecting) return;
            
            var cx = (x <= this._originalX) ? x : this._originalX;
            var cy = (y <= this._originalY) ? y : this._originalY;

            var nx = (x >= this._originalX) ? x : this._originalX;
            var ny = (y >= this._originalY) ? y : this._originalY;

            this._selectPane.style.left = cx + 'px';
            this._selectPane.style.top = cy + 'px';
            this._selectPane.style.width = (nx - cx) + 'px';
            this._selectPane.style.height = (ny - cy) + 'px';

            //this.originalX = cx;
            //this.originalY = cy;
        }

        private selectEnd() {
            if (!this._isSelecting) return;
            document.body.removeChild(this._selectPane);
            this._isSelecting = false;
        }

        private _isAwaitingSelection: boolean = false;
        afterDrawn: (e: ITableEventArgs<any>) => void = (a) => {
            PowerTables.EventsDelegatorService.addHandler(this.MasterTable.Renderer.RootElement, "mousedown", (e: MouseEvent) => {
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
            PowerTables.EventsDelegatorService.addHandler(this.MasterTable.Renderer.RootElement, "mousemove", (e: MouseEvent) => {
                if (this._isSelecting) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                this.move(e.pageX, e.pageY);
                return true;
            });

            PowerTables.EventsDelegatorService.addHandler(document.documentElement, "mouseup", (e: MouseEvent) => {
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