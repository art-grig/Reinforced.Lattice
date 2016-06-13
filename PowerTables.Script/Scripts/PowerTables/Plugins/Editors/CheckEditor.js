var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        var Editors;
        (function (Editors) {
            var CheckEditor = (function (_super) {
                __extends(CheckEditor, _super);
                function CheckEditor() {
                    _super.apply(this, arguments);
                }
                CheckEditor.prototype.renderContent = function (templatesProvider) {
                    return this.defaultRender(templatesProvider);
                };
                CheckEditor.prototype.changedHandler = function (e) {
                    this._value = !this._value;
                    this.updateState();
                    _super.prototype.changedHandler.call(this, e);
                };
                CheckEditor.prototype.updateState = function () {
                    if (!this._value) {
                        this.VisualStates.unmixinState('checked');
                    }
                    else {
                        this.VisualStates.mixinState('checked');
                    }
                };
                CheckEditor.prototype.getValue = function (errors) {
                    if (this.Configuration.IsMandatory && !this._value) {
                        errors.push({ Code: 'MANDATORY', Message: this.Column.Configuration.Title + " is required" });
                        return null;
                    }
                    return this._value;
                };
                CheckEditor.prototype.setValue = function (value) {
                    this._value = (!(!value));
                    this.updateState();
                };
                CheckEditor.prototype.focus = function () {
                    if (this.FocusElement)
                        this.FocusElement.focus();
                };
                return CheckEditor;
            }(Editors.CellEditorBase));
            Editors.CheckEditor = CheckEditor;
            PowerTables.ComponentsContainer.registerComponent('CheckEditor', CheckEditor);
        })(Editors = Plugins.Editors || (Plugins.Editors = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=../../../../../../PowerTables.Mvc/Scripts/pt/PowerTables.Script/Scripts/PowerTables/Plugins/Editors/CheckEditor.js.map