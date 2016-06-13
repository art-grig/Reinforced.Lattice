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
            var CellEditorBase = (function (_super) {
                __extends(CellEditorBase, _super);
                function CellEditorBase() {
                    _super.apply(this, arguments);
                }
                CellEditorBase.prototype.renderedValidationMessages = function () {
                    return this.MasterTable.Renderer.getCachedTemplate(this.Configuration.ValidationMessagesTemplateId)({
                        Messages: this.ValidationMessages,
                        IsRowEdit: this.IsRowEdit,
                        IsFormEdit: this.IsFormEdit
                    });
                };
                /**
                 * Retrieves original value for this particular cell editor
                 *
                 * @returns {Any} Original, unchanged value
                 */
                CellEditorBase.prototype.getThisOriginalValue = function () {
                    return this.DataObject[this.Column.RawName];
                };
                /**
                 * Resets editor value to initial settings
                 */
                CellEditorBase.prototype.reset = function () {
                    this.setValue(this.getThisOriginalValue());
                };
                /**
                 * Returns entered editor value
                 *
                 * @returns {}
                 */
                CellEditorBase.prototype.getValue = function (errors) { throw new Error("Not implemented"); };
                /**
                 * Sets editor value from the outside
                 */
                CellEditorBase.prototype.setValue = function (value) { throw new Error("Not implemented"); };
                /**
                 * Template-bound event raising on changing this editor's value
                 */
                CellEditorBase.prototype.changedHandler = function (e) {
                    if (this.IsInitialValueSetting)
                        return;
                    this.Row.notifyChanged(this);
                };
                /**
                 * Event handler for commit (save edited, ok, submit etc) event raised from inside of CellEditor
                 * Commit leads to validation. Cell editor should be notified
                 */
                CellEditorBase.prototype.commitHandler = function (e) {
                    this.Row.commit(this);
                };
                /**
                 * Event handler for reject (cancel editing) event raised from inside of CellEditor
                 * Cell editor should be notified
                 */
                CellEditorBase.prototype.rejectHandler = function (e) {
                    this.Row.reject(this);
                };
                /**
                 * Called when cell editor has been drawn
                 *
                 * @param e HTML element where editor is rendered
                 * @returns {}
                 */
                CellEditorBase.prototype.onAfterRender = function (e) { };
                /**
                 * Needed by editor in some cases
                 *
                 * @returns {}
                 */
                CellEditorBase.prototype.focus = function () { };
                CellEditorBase.prototype.OriginalContent = function () {
                    return this.MasterTable.Renderer.ContentRenderer.renderCell(this);
                };
                return CellEditorBase;
            }(Plugins.PluginBase));
            Editors.CellEditorBase = CellEditorBase;
        })(Editors = Plugins.Editors || (Plugins.Editors = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=../../../../../../PowerTables.Mvc/Scripts/pt/PowerTables.Script/Scripts/PowerTables/Plugins/Editors/CellEditorBase.js.map