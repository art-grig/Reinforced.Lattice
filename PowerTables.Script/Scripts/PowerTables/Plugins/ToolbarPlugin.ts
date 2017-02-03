module PowerTables.Plugins.Toolbar {
    /**
     * Client-side supply for Toolbar plugin
     */
    export class ToolbarPlugin extends PluginBase<Plugins.Toolbar.IToolbarButtonsClientConfiguration> {
        /**
         * HTML elements of all buttons that are registered for usage within toolbar plugin. Key= internal button id, Value = HTML element corresponding to button
         */
        public AllButtons: { [id: number]: HTMLElement } = {};
        private _buttonsConfig: { [key: number]: Plugins.Toolbar.IToolbarButtonClientConfiguration } = {}

        /**
         * Simulates event happened on particular button. Internal button id must be supplied as first member of @memberref PowerTables.ITemplateBoundEvent.EventArguments
         * 
         * @param e Template bound event for triggering button action
         */
        public buttonHandleEvent(e: PowerTables.ITemplateBoundEvent): void {
            var btnId = e.EventArguments[0];
            this.handleButtonAction(this._buttonsConfig[btnId]);
        }

        private redrawMe() {
            this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }

        private handleButtonAction(btn: Plugins.Toolbar.IToolbarButtonClientConfiguration) {
            if (btn.OnClick) {
                btn.OnClick.call(this.MasterTable, this.MasterTable, this.AllButtons[btn.InternalId]);
            }
            if (btn.Command) {
                if (btn.BlackoutWhileCommand) {
                    btn.IsDisabled = true;
                    this.redrawMe();
                    this.MasterTable.Commands.triggerCommand(btn.Command,
                        null,
                        r => {
                            btn.IsDisabled = false;
                            this.redrawMe();
                        });
                } else {
                    this.MasterTable.Commands.triggerCommand(btn.Command, null);
                }

            }
        }
        /*
         * @internal
         */
        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        private traverseButtons(arr: Plugins.Toolbar.IToolbarButtonClientConfiguration[]) {
            for (var i: number = 0; i < arr.length; i++) {
                this._buttonsConfig[arr[i].InternalId] = arr[i];
                if (arr[i].HasSubmenu) {
                    this.traverseButtons(arr[i].Submenu);
                }
            }
        }

        private onSelectionChanged(e: ITableEventArgs<string[]>) {
            var atleastOne: boolean = false;
            var disabled: boolean = true;
            for (var d in e.EventArgs) {
                disabled = false;
                break;
            }

            for (var bc in this._buttonsConfig) {
                if (this._buttonsConfig.hasOwnProperty(bc)) {
                    if (this._buttonsConfig[bc].DisableIfNothingChecked) {
                        if (this._buttonsConfig[bc].IsDisabled !== disabled) {
                            atleastOne = true;
                            this._buttonsConfig[bc].IsDisabled = disabled;
                        }
                    }
                }
            }
            if (atleastOne) this.MasterTable.Renderer.Modifier.redrawPlugin(this);
        }
        /*
         * @internal
         */
        public init(masterTable: IMasterTable): void {
            super.init(masterTable);

            var nothingSelected: boolean = this.MasterTable.Selection.getSelectedKeys().length === 0;
            for (var i: number = 0; i < this.Configuration.Buttons.length; i++) {
                if (this.Configuration.Buttons[i].DisableIfNothingChecked) {
                    this.Configuration.Buttons[i].IsDisabled = nothingSelected;
                }
            }

            this.traverseButtons(this.Configuration.Buttons);
            this.MasterTable.Events.SelectionChanged.subscribe(this.onSelectionChanged.bind(this), 'toolbar');
        }
    }

    ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
}