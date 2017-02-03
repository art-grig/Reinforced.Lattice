module PowerTables.Plugins.Loading {
    export class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        public BlinkElement: HTMLElement;
        public subscribe(e: PowerTables.Services.EventsService): void {
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

        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            this.defaultRender(p);
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