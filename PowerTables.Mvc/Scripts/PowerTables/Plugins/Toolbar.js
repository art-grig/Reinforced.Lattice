var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var ToolbarPlugin = (function (_super) {
        __extends(ToolbarPlugin, _super);
        function ToolbarPlugin() {
            _super.call(this, 'pt-toolbar');
            this._buttonConfigById = {};
            this._selectionListeners = [];
            this._btnsCounter = 0;
            this.IsToolbarPlugin = true;
            this.PluginId = 'Toolbar';
            this.IsRenderable = true;
            this.IsQueryModifier = false;
        }
        ToolbarPlugin.prototype.init = function (table, configuration) {
            _super.prototype.init.call(this, table, configuration);
            this.buildConfigCache(this.Configuration.Buttons);
            this.MasterTable.Events.SelectionChanged.subscribe(this.onSelectionChanged.bind(this), 'toolbar');
        };
        ToolbarPlugin.prototype.onSelectionChanged = function (selection) {
            if (selection.length > 0) {
                for (var i = 0; i < this._selectionListeners.length; i++) {
                    this.enable(this._selectionListeners[i]);
                }
            }
            else {
                for (var j = 0; j < this._selectionListeners.length; j++) {
                    this.disable(this._selectionListeners[j]);
                }
            }
        };
        ToolbarPlugin.prototype.buildConfigCache = function (config) {
            if (!config)
                return;
            for (var i = 0; i < config.length; i++) {
                config[i].TempId = 'button_' + this._btnsCounter;
                this._btnsCounter++;
                var conf = config[i];
                this._buttonConfigById[conf.TempId] = conf;
                this.buildConfigCache(conf.Submenu);
            }
        };
        ToolbarPlugin.prototype.subscribeEvents = function (parentElement) {
            var _self = this;
            parentElement.find('[data-role="toolbar-btn"]').each(function () {
                var thisConf = _self._buttonConfigById[$(this).data('idx')];
                if (!thisConf)
                    return;
                _self.setupButton($(this), thisConf);
            });
        };
        ToolbarPlugin.prototype.disable = function (el) {
            el.attr('disabled', 'disabled');
            el.addClass('disabled');
        };
        ToolbarPlugin.prototype.enable = function (el) {
            el.removeAttr('disabled');
            el.removeClass('disabled');
        };
        ToolbarPlugin.prototype.setupButton = function (button, config) {
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
            }
            else {
                if (config.Command) {
                    button.click(function (e) {
                        if ($(this).is('.disabled')) {
                            e.stopPropagation();
                            return;
                        }
                        var _self2 = this;
                        _self.MasterTable.requestServer(config.Command, function (response) {
                            if (config.CommandCallbackFunction) {
                                config.CommandCallbackFunction.apply(_self.MasterTable, [_self.MasterTable, response]);
                            }
                            if (config.BlackoutWhileCommand) {
                                _self.enable($(_self2));
                            }
                        });
                        if (config.BlackoutWhileCommand)
                            _self.disable($(this));
                    });
                }
            }
        };
        return ToolbarPlugin;
    })(PowerTables.PluginBase);
    PowerTables.ToolbarPlugin = ToolbarPlugin;
    PowerTables.ComponentsContainer.registerComponent('Toolbar', ToolbarPlugin);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Toolbar.js.map