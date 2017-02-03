module PowerTables.Rendering.Drivers {
    export class LayoutDriver extends DriverBase {
        private _masterTable:IMasterTable;

        public body(w: IWriteFn) {
            w('<input type="hidden" data-track="tableBodyHere" style="display:none;"/>');
        }

        private plugins(w: IWriteFn, pluginPosition: string, pluginId: string) {
            var plugin: IPlugin = this._instances.getPlugin<IPlugin>(pluginId, pluginPosition);
            return this.renderPlugin(plugin);
        }

        /**
        * Renders specified plugin into string including its wrapper
        * 
        * @param plugin Plugin interface
        * @returns {} 
        */
        public renderPlugin(plugin: IPlugin): string {
            if (plugin.renderElement) return plugin.renderElement(this._templatesProvider);
            if (!plugin.renderContent) return '';
            this._stack.push(RenderingContextType.Plugin, plugin);
            var result: string = this._templatesProvider.getCachedTemplate(this._templateIds.PluginWrapper)(plugin);
            this._stack.popContext();
            return result;
        }
    }
}