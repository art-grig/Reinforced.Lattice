module PowerTables.Plugins {
    import ToolbarButtonsClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonsClientConfiguration;
    import ToolbarButtonClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration;

    export class ToolbarPlugin extends PluginBase<ToolbarButtonsClientConfiguration> {
        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('toolbar')(this);
        }
    }
    ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
} 