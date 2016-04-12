module PowerTables.Plugins {
    import ToolbarButtonsClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonsClientConfiguration;
    import ToolbarButtonClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration;
    import TemplateBoundEvent = PowerTables.Rendering.ITemplateBoundEvent;

    export class ToolbarPlugin extends PluginBase<ToolbarButtonsClientConfiguration> {

        public AllButtons: {[key:number]:HTMLElement} = {};

        
        public buttonHandleEvent(e:TemplateBoundEvent<TotalsPlugin>) {
            var btnId = e.EventArguments[0];
            alert(btnId);
        }

        renderContent(templatesProvider: ITemplatesProvider): string {
            return templatesProvider.getCachedTemplate('toolbar')(this);
        }
    }
    ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
} 