declare module PowerTables.Plugins {
    /**
     * Base class for plugins.
     * It contains necessary infrastructure for convinence of plugins creation
     */
    class PluginBase<TConfiguration> implements IPlugin {
        init(masterTable: IMasterTable): void;
        /**
         * Raw plugin configuration
         */
        RawConfig: Configuration.Json.IPluginConfiguration;
        /**
         * Plugin location ID
         */
        PluginLocation: string;
        /**
         * Plugin's visual states collection.
         * Usually it is not used, but always it is better to have one
         */
        VisualStates: PowerTables.Rendering.VisualState;
        /**
         * Plugin configuration object
         */
        protected Configuration: TConfiguration;
        /**
         * Reference to master table this plugin belongs to
         */
        MasterTable: IMasterTable;
        /**
         * Events subscription method.
         * In derived class here should be subscription to various events
         *
         * @param e Events manager
         */
        protected subscribe(e: EventsManager): void;
        /**
         * In this method you can register any additional Handlebars.js helpers in case of your
         * templates needs ones
         *
         * @param hb Handlebars instance
         * @returns {}
         */
        protected registerAdditionalHelpers(hb: Handlebars.IHandlebars): void;
        /**
         * Function that is called after plugin is drawn
         *
         * @param e Event arguments
         */
        protected afterDrawn: (e: ITableEventArgs<any>) => void;
        /**
         * Plugin order among particular placement
         */
        Order: number;
        /**
         * Default render function using TemplateId from plugin configuration
         * @param e Templates provider
         * @returns content string
         */
        defaultRender(e: ITemplatesProvider): string;
    }
}
