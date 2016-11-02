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
         * Simulates event happened on particular button. Internal button id must be supplied as first member of @memberref PowerTables.Rendering.ITemplateBoundEvent.EventArguments
         * 
         * @param e Template bound event for triggering button action
         */
        public buttonHandleEvent(e: Rendering.ITemplateBoundEvent):void {
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
                var _self: ToolbarPlugin = this;

                // ReSharper disable Lambda
                var f: (queryModifier?: (a: IQuery) => IQuery, success?: () => void, error?: () => void) => void
                    =
                    function (queryModifier?: (a: IQuery) => IQuery, success?: () => void, error?: () => void) {
                        if (btn.BlackoutWhileCommand) {
                            btn.IsDisabled = true;
                            _self.redrawMe();
                        }

                        _self.MasterTable.Loader.requestServer(btn.Command, function (response) {
                            if (btn.CommandCallbackFunction) {
                                btn.CommandCallbackFunction.apply(_self.MasterTable, [_self.MasterTable, response]);
                            } else {
                                if (response.$isDeferred && response.$url) {
                                    window.location.href = response.$url;
                                }
                            }
                            if (btn.BlackoutWhileCommand) {
                                btn.IsDisabled = false;
                                _self.redrawMe();
                            }
                            if (success) success();

                        }, queryModifier, function () {
                            if (btn.BlackoutWhileCommand) {
                                btn.IsDisabled = false;
                                _self.redrawMe();
                            }
                            if (error) error();
                        });
                    }
                // ReSharper restore Lambda
                if (btn.ConfirmationFunction) btn.ConfirmationFunction.apply(this.MasterTable, [f, this.MasterTable]);
                else if (btn.ConfirmationTemplateId) {
                    var tc = new PowerTables.Plugins.Toolbar.CommandConfirmation((data) => {
                        f((q) => {
                            q.AdditionalData['Confirmation'] = JSON.stringify(data);
                            return q;
                        }, () => {
                            tc.fireEvents(tc.Form, tc.AfterConfirmationResponse);
                        }, () => {
                            tc.fireEvents(tc.Form, tc.ConfirmationResponseError);
                        });
                        this.MasterTable.Renderer.destroyObject(btn.ConfirmationTargetSelector);
                    }, () => {
                        this.MasterTable.Renderer.destroyObject(btn.ConfirmationTargetSelector);
                    }, this.MasterTable.Date, btn.ConfirmationFormConfiguration);

                    try {
                        tc.SelectedItems = this.MasterTable.Selection.getSelectedKeys();
                        tc.SelectedObjects = this.MasterTable.Selection.getSelectedObjects();
                    } catch (e) { }
                    var r = this.MasterTable.Renderer.renderObject(btn.ConfirmationTemplateId, tc, btn.ConfirmationTargetSelector);
                    tc.RootElement = r;
                }
                else f();
            }
        }
/*
 * @internal
 */
        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
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
            var disabled: boolean = e.EventArgs.length === 0;

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
            try {
                
                var nothingSelected: boolean = this.MasterTable.Selection.getSelectedKeys().length === 0;
                for (var i: number = 0; i < this.Configuration.Buttons.length; i++) {
                    if (this.Configuration.Buttons[i].DisableIfNothingChecked) {
                        this.Configuration.Buttons[i].IsDisabled = nothingSelected;
                    }
                }
            } catch (e) {
            }
            this.traverseButtons(this.Configuration.Buttons);
            this.MasterTable.Events.SelectionChanged.subscribe(this.onSelectionChanged.bind(this), 'toolbar');
        }
    }

    ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
}