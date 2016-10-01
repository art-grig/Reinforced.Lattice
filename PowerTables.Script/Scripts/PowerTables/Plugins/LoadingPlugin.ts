module PowerTables.Plugins.Loading {
    export class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        public BlinkElement: HTMLElement;
        public subscribe(e: EventsManager): void {
            e.Loading.subscribeBefore(() => this.showLoadingIndicator(), 'loading');
            e.Loading.subscribeAfter(() => this.hideLoadingIndicator(), 'loading');
            e.LayoutRendered.subscribeAfter(() => {
                this.hideLoadingIndicator();
            }, 'loading');
            
        }
        
        public showLoadingIndicator() {
            this.MasterTable.Renderer.Modifier.showElement(this.BlinkElement);
        }

        public hideLoadingIndicator() {
            this.MasterTable.Renderer.Modifier.hideElement(this.BlinkElement);
        }

        public static Id = 'Loading';

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
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