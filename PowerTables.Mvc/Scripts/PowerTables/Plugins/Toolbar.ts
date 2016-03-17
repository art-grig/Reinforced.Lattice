module PowerTables {
    import ToolbarButtonsClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonsClientConfiguration;
    import ToolbarButtonClientConfiguration = PowerTables.Plugins.Toolbar.IToolbarButtonClientConfiguration;

    export class ToolbarPlugin
        extends PluginBase<ToolbarButtonsClientConfiguration> {

        private _buttonConfigById: { [key: string]: ToolbarButtonClientConfiguration } = {};
        private _selectionListeners: JQuery[] = [];
        private _btnsCounter: number = 0;
        constructor() {
            super('pt-toolbar');
        }

        subscribe(e: EventsManager): void {
            this.buildConfigCache(this.Configuration.Buttons);
            e.SelectionChanged.subscribe(this.onSelectionChanged.bind(this), 'toolbar');
        }

        onSelectionChanged(selection: string[]) {
            if (selection.length > 0) {
                for (var i = 0; i < this._selectionListeners.length; i++) {
                    this.enable(this._selectionListeners[i]);
                }
            } else {
                for (var j = 0; j < this._selectionListeners.length; j++) {
                    this.disable(this._selectionListeners[j]);
                }
            }
        }
        private buildConfigCache(config: ToolbarButtonClientConfiguration[]) {
            if (!config) return;
            for (var i = 0; i < config.length; i++) {
                config[i].TempId = 'button_' + this._btnsCounter;
                this._btnsCounter++;
                var conf = config[i];
                this._buttonConfigById[conf.TempId] = conf;
                this.buildConfigCache(conf.Submenu);
            }
        }
        
        subscribeEvents(parentElement: JQuery): void {
            var _self = this;
            parentElement.find('[data-role="toolbar-btn"]').each(function () {
                var thisConf = _self._buttonConfigById[$(this).data('idx')];
                if (!thisConf) return;
                _self.setupButton($(this), thisConf);
            });
        }
        private disable(el: JQuery) {
            el.attr('disabled', 'disabled');
            el.addClass('disabled');
        }

        private enable(el: JQuery) {
            el.removeAttr('disabled');
            el.removeClass('disabled');
        }

        private setupButton(button: JQuery, config: ToolbarButtonClientConfiguration) {
            var _self = this;
            if (config.DisableIfNothingChecked) {
                this._selectionListeners.push(button);
                this.disable(button);
            }
            if (config.OnClick) {
                button.click(function (e) {
                    if ($(this).is('.disabled')) {
                        e.stopPropagation();
                        return;
                    }
                    config.OnClick.apply(this, [_self.MasterTable]);
                });
            } else {
                if (config.Command) {
                    button.click(function (e) {
                        if ($(this).is('.disabled')) {
                            e.stopPropagation();
                            return;
                        }
                        var _self2 = this;
                        var f = function (queryModifier?: (a: IQuery) => IQuery) {
                            if (config.BlackoutWhileCommand) _self.disable($(_self2)); 
                               
                            _self.MasterTable.requestServer(config.Command, function (response) {
                                if (config.CommandCallbackFunction) {
                                    config.CommandCallbackFunction.apply(_self.MasterTable, [_self.MasterTable, response]);
                                }else
                                {
                                    if (response.$isDeferred && response.$url) {
                                        window.location.href = response.$url;
                                    }
                                }
                                if (config.BlackoutWhileCommand) {
                                    _self.enable($(_self2));
                                }
                                
                            },queryModifier);    
                        }

                        if (config.ConfirmationFunction) {
                            config.ConfirmationFunction.apply(_self.MasterTable, [f]);
                        } else {
                            f();
                        }
                    });
                }
            }
        }

        IsToolbarPlugin: boolean = true;
        PluginId: string = 'Toolbar';
        IsRenderable: boolean = true;
        IsQueryModifier: boolean = false;

            
        }

    ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
}  