module PowerTables.Plugins {
    export class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        public BlinkElement: HTMLElement;
        public subscribe(e: EventsManager): void {
            e.BeforeLoading.subscribe(() => this.showLoadingIndicator(), "loading");
            e.AfterLoading.subscribe(() => this.hideLoadingIndicator(), "loading");
            e.AfterLayoutRendered.subscribe(() => {
                this.hideLoadingIndicator();
            }, 'loading');
            
        }
        
        public showLoadingIndicator() {
            this.BlinkElement.style.visibility = 'visible';
        }

        public hideLoadingIndicator() {
            this.BlinkElement.style.visibility = 'collapse';
        }

        public static Id = 'Loading';

        public renderContent(templatesProvider: ITemplatesProvider): string {
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