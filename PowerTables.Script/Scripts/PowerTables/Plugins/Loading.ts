module PowerTables.Plugins {
    export class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        subscribe(e: EventsManager): void {
            e.BeforeLoading.subscribe(() => this.showLoadingIndicator(), "loading");
            e.AfterLoading.subscribe(() => this.hideLoadingIndicator(), "loading");
            e.AfterLayoutRendered.subscribe(() => {
                var me = this.MasterTable.Renderer.Locator.getPluginElement(this);
                this._blinkElement = <HTMLElement>me.querySelector('[data-blink]');
                this.hideLoadingIndicator();
            }, 'loading');
            
        }
        private _blinkElement:HTMLElement;
        public showLoadingIndicator() {
            this._blinkElement.style.visibility = 'visible';
        }

        public hideLoadingIndicator() {
            this._blinkElement.style.visibility = 'collapse';
        }

        public static Id: string = 'Loading';

        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('loading')(null);
        }
    }
    ComponentsContainer.registerComponent('Loading', LoadingPlugin);

    /**
     * Loading indicator plugin. 
     * Plugin Id: Loading
     */
    export interface ILoadingPlugin {
        /**
         * Shows loading indicator
         */
        showLoadingIndicator(): void;

        /**
         * Hides loading indicator
         */
        hideLoadingIndicator(): void;
    }
} 