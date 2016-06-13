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
            var SelectListEditor = (function (_super) {
                __extends(SelectListEditor, _super);
                function SelectListEditor() {
                    _super.apply(this, arguments);
                }
                SelectListEditor.prototype.getValue = function (errors) {
                    var selectedOption = this.List.options.item(this.List.selectedIndex);
                    var item = selectedOption.value.toString();
                    var value = null;
                    if (item.length === 0) {
                        if (this.Column.IsString && this.Configuration.AllowEmptyString)
                            value = item;
                        if (this.Column.Configuration.IsNullable)
                            value = null;
                        else {
                            errors.push({ Code: 'NULLVALUE', Message: "Value must be provided for " + this.Column.Configuration.Title });
                        }
                    }
                    else {
                        if (this.Column.IsEnum || this.Column.IsInteger)
                            value = parseInt(item);
                        else if (this.Column.IsFloat)
                            value = parseFloat(item);
                        else if (this.Column.IsBoolean)
                            value = item.toUpperCase() === 'TRUE';
                        else if (this.Column.IsDateTime)
                            value = this.MasterTable.Date.parse(item);
                        else
                            errors.push({ Code: 'UNKNOWN', Message: "Unknown value for " + this.Column.Configuration.Title });
                    }
                    return value;
                };
                SelectListEditor.prototype.setValue = function (value) {
                    var strvalue = this.Column.IsDateTime ? this.MasterTable.Date.serialize(value) : value.toString();
                    for (var i = 0; i < this.List.options.length; i++) {
                        if (this.List.options.item(i).value === strvalue) {
                            this.List.options.item(i).selected = true;
                        }
                    }
                    for (var i = 0; i < this.Items.length; i++) {
                        if (this.Items[i].Value == strvalue) {
                            this.SelectedItem = this.Items[i];
                            break;
                        }
                    }
                    this.VisualStates.mixinState('selected');
                };
                SelectListEditor.prototype.onStateChange = function (e) {
                    if (e.State !== 'selected' && e.State !== 'saving') {
                        this.VisualStates.mixinState('selected');
                    }
                };
                SelectListEditor.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    this.Items = this.Configuration.SelectListItems;
                    if (this.Configuration.AddEmptyElement) {
                        var empty = {
                            Text: this.Configuration.EmptyElementText,
                            Value: '',
                            Disabled: false,
                            Selected: false
                        };
                        this.Items = [empty].concat(this.Items);
                    }
                };
                SelectListEditor.prototype.renderContent = function (templatesProvider) {
                    return this.defaultRender(templatesProvider);
                };
                SelectListEditor.prototype.onAfterRender = function (e) {
                    if (this.VisualStates) {
                        this.VisualStates.subscribeStateChange(this.onStateChange.bind(this));
                    }
                };
                SelectListEditor.prototype.changedHandler = function (e) {
                    _super.prototype.changedHandler.call(this, e);
                    var item = this.List.options.item(this.List.selectedIndex).value;
                    for (var i = 0; i < this.Items.length; i++) {
                        if (this.Items[i].Value == item) {
                            this.SelectedItem = this.Items[i];
                            break;
                        }
                    }
                    this.VisualStates.mixinState('selected');
                };
                SelectListEditor.prototype.focus = function () {
                    this.List.focus();
                };
                return SelectListEditor;
            }(Editors.CellEditorBase));
            Editors.SelectListEditor = SelectListEditor;
            PowerTables.ComponentsContainer.registerComponent('SelectListEditor', SelectListEditor);
        })(Editors = Plugins.Editors || (Plugins.Editors = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=../../../../../../PowerTables.Mvc/Scripts/pt/PowerTables.Script/Scripts/PowerTables/Plugins/Editors/SelectListEditor.js.map