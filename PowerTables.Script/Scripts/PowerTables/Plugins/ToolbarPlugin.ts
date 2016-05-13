module PowerTables.Plugins {
    export class ToolbarPlugin extends PluginBase<Plugins.Toolbar.IToolbarButtonsClientConfiguration> {
        public AllButtons: { [id: number]: HTMLElement } = {};
        private _buttonsConfig: { [key: number]: Plugins.Toolbar.IToolbarButtonClientConfiguration } = {}

        public buttonHandleEvent(e: Rendering.ITemplateBoundEvent) {
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
                var f: (queryModifier?: (a: IQuery) => IQuery) => void = function (queryModifier?: (a: IQuery) => IQuery) {
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

                    }, queryModifier, function () {
                            if (btn.BlackoutWhileCommand) {
                                btn.IsDisabled = false;
                                _self.redrawMe();
                            }
                        });
                }
                // ReSharper restore Lambda
                if (btn.ConfirmationFunction) btn.ConfirmationFunction.apply(this.MasterTable, [f]);
                else if (btn.ConfirmationTemplateId) {
                    var tc = new ToolbarConfirmation((data) => {
                        f((q) => {
                            q.AdditionalData['Confirmation'] = JSON.stringify(data);
                            return q;
                        });
                        this.MasterTable.Renderer.destroyObject(btn.ConfirmationTargetSelector);
                    }, () => { this.MasterTable.Renderer.destroyObject(btn.ConfirmationTargetSelector); }, this.MasterTable.Date, btn.ConfirmationFormConfiguration);
                    
                    try {
                        var chb = this.MasterTable.InstanceManager.getPlugin<CheckboxifyPlugin>('Checkboxify');
                        var selection = chb.getSelection();
                        tc.SelectedItems = selection;
                        var objects = [];
                        if (selection.length > 0) {
                            var foundCount = 0;
                            for (var i = 0; i < this.MasterTable.DataHolder.StoredData.length; i++) {
                                var obj = this.MasterTable.DataHolder.StoredData[i];
                                if (selection.indexOf(obj[chb.ValueColumnName].toString()) > -1) {
                                    objects.push(obj);
                                    foundCount++;
                                    if (foundCount === selection.length) break;
                                }
                            }
                        }
                        tc.SelectedObjects = objects;
                    } catch (e) { }
                    var r = this.MasterTable.Renderer.renderObject(btn.ConfirmationTemplateId, tc, btn.ConfirmationTargetSelector);
                    tc.RootElement = r;
                }
                else f();
            }
        }

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

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            try {
                var p: Plugins.CheckboxifyPlugin = this.MasterTable.InstanceManager.getPlugin<CheckboxifyPlugin>('Checkboxify');
                var nothingSelected: boolean = p.getSelection().length === 0;
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