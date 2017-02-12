declare module PowerTables.Plugins {
    class LoadingPlugin extends PluginBase<any> implements ILoadingPlugin {
        BlinkElement: HTMLElement;
        subscribe(e: EventsManager): void;
        showLoadingIndicator(): void;
        hideLoadingIndicator(): void;
        static Id: string;
        renderContent(templatesProvider: ITemplatesProvider): string;
    }
    /**
     * Loading indicator plugin.
     * Plugin Id: Loading
     */
    interface ILoadingPlugin {
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
