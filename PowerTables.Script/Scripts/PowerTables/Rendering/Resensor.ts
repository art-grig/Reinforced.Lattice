module PowerTables.Rendering {
    export class Resensor {
        constructor(element: HTMLElement,handler:any) {
            this._element = element;
            this._handler = handler;
            this._resizeBoud = this.onResized.bind(this);
            this.requestAnimationFrame = window.requestAnimationFrame ||
                window['mozRequestAnimationFrame'] ||
                window['webkitRequestAnimationFrame'] ||
                function (fn) {
                    return window.setTimeout(fn, 20);
                };
        }

        private requestAnimationFrame :any;
        private _resizeBoud:any;
        private _handler: any;
        private _sensor: HTMLElement;
        private _expandChild: HTMLElement;
        private _expand: HTMLElement;
        private _shrink: HTMLElement;
        private _lastWidth: number;
        private _lastHeight: number;

        private _newWidth: number;
        private _newHeight: number;
        private _dirty: boolean;
        private _element: HTMLElement;
        private _rafId: any;

        public attach() {
            this._sensor = document.createElement('div');
            this._sensor.className = 'resize-sensor';
            var style =
                'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            this._sensor.style.cssText = style;
            this._sensor.innerHTML =
                `<div class="resize-sensor-expand" style="${style}"><div style="${styleChild
                }"></div></div><div class="resize-sensor-shrink" style="${style}"><div style="${styleChild
                } width: 200%; height: 200%"></div></div>`;
            this._element.appendChild(this._sensor);

            if (Resensor.getComputedStyle(this._element, 'position') == 'static') {
                this._element.style.position = 'relative';
            }

            this._expand = <any>this._sensor.childNodes.item(0);
            this._expandChild = <any>this._expand.childNodes[0];
            this._shrink = <any>this._sensor.childNodes[1];
            this._lastWidth = this._element.offsetWidth;
            this._lastHeight = this._element.offsetHeight;
            this.reset();
            PowerTables.Services.EventsDelegatorService.addHandler(this._expand,'scroll',this.onScroll.bind(this));
            PowerTables.Services.EventsDelegatorService.addHandler(this._shrink,'scroll',this.onScroll.bind(this));
        }

        private onResized() {
            this._rafId = 0;

            if (!this._dirty) return;

            this._lastWidth = this._newWidth;
            this._lastHeight = this._newHeight;

            this._handler.call();
        }

        private onScroll() {
            this._newWidth = this._element.offsetWidth;
            this._newHeight = this._element.offsetHeight;
            this._dirty = this._newWidth != this._lastWidth || this._newHeight != this._lastHeight;

            var bnd = this._resizeBoud;
            if (this._dirty && !this._rafId) {
                this._rafId = this.requestAnimationFrame.call(window, function () { bnd(); });
            }

            this.reset();
        }

        private reset() {
            this._expandChild.style.width = '100000px';
            this._expandChild.style.height = '100000px';

            this._expand.scrollLeft = 100000;
            this._expand.scrollTop = 100000;

            this._shrink.scrollLeft = 100000;
            this._shrink.scrollTop = 100000;
        }

        private static getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }
    }
}