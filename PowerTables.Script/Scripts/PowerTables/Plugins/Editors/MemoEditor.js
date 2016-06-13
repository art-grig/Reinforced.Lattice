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
            var MemoEditor = (function (_super) {
                __extends(MemoEditor, _super);
                function MemoEditor() {
                    _super.apply(this, arguments);
                }
                MemoEditor.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    this.MaxChars = this.Configuration.MaxChars;
                    this.WarningChars = this.Configuration.WarningChars;
                    this.Rows = this.Configuration.Rows;
                    this.Columns = this.Configuration.Columns;
                    this.CurrentChars = 0;
                };
                MemoEditor.prototype.changedHandler = function (e) {
                    this.CurrentChars = this.TextArea.value.length;
                    if (this.WarningChars !== 0 && this.CurrentChars >= this.WarningChars && this.CurrentChars <= this.MaxChars) {
                        this.VisualStates.mixinState('warning');
                    }
                    else {
                        this.VisualStates.unmixinState('warning');
                    }
                    _super.prototype.changedHandler.call(this, e);
                };
                MemoEditor.prototype.setValue = function (value) {
                    this.TextArea.value = value;
                };
                MemoEditor.prototype.getValue = function (errors) {
                    var value = this.TextArea.value;
                    if (this.MaxChars > 0 && value.length > this.MaxChars) {
                        errors.push({ Code: 'MAXCHARS', Message: "Maximum " + this.Column.Configuration.Title + " length exceeded" });
                        return null;
                    }
                    return value;
                };
                MemoEditor.prototype.renderContent = function (templatesProvider) {
                    return this.defaultRender(templatesProvider);
                };
                MemoEditor.prototype.focus = function () {
                    this.TextArea.focus();
                    this.TextArea.setSelectionRange(0, this.TextArea.value.length);
                };
                return MemoEditor;
            }(Editors.CellEditorBase));
            Editors.MemoEditor = MemoEditor;
            PowerTables.ComponentsContainer.registerComponent('MemoEditor', MemoEditor);
        })(Editors = Plugins.Editors || (Plugins.Editors = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=../../../../../../PowerTables.Mvc/Scripts/pt/PowerTables.Script/Scripts/PowerTables/Plugins/Editors/MemoEditor.js.map