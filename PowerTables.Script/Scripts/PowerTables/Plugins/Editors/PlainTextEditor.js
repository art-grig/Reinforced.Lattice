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
            var PlainTextEditor = (function (_super) {
                __extends(PlainTextEditor, _super);
                function PlainTextEditor() {
                    _super.apply(this, arguments);
                    this._floatRegex = new RegExp("^[0-9]+(\.[0-9]+)?$");
                }
                PlainTextEditor.prototype.getValue = function (errors) {
                    if (this.Column.IsDateTime) {
                        var d = this.MasterTable.Date.getDateFromDatePicker(this.Input);
                        if ((d == null) && !this.Column.Configuration.IsNullable) {
                            errors.push({ Code: 'NULL', Message: this.Column.Configuration.Title + " value is mandatory" });
                            return null;
                        }
                        return d;
                    }
                    else {
                        return this._parseFunction(this.Input.value, this.Column, errors);
                    }
                };
                PlainTextEditor.prototype.setValue = function (value) {
                    if (this.Column.IsDateTime) {
                        this.MasterTable.Date.putDateToDatePicker(this.Input, value);
                    }
                    else {
                        this.Input.value = this._formatFunction(value, this.Column);
                    }
                };
                PlainTextEditor.prototype.init = function (masterTable) {
                    _super.prototype.init.call(this, masterTable);
                    if (this.Configuration.ValidationRegex) {
                        this.ValidationRegex = new RegExp(this.Configuration.ValidationRegex);
                    }
                    this._dotSeparators = new RegExp(this.Configuration.FloatDotReplaceSeparatorsRegex);
                    this._removeSeparators = new RegExp(this.Configuration.FloatRemoveSeparatorsRegex);
                    this._parseFunction = this.Configuration.ParseFunction || this.defaultParse;
                    this._formatFunction = this.Configuration.FormatFunction || this.defaultFormat;
                };
                PlainTextEditor.prototype.defaultParse = function (value, column, errors) {
                    if (this.ValidationRegex) {
                        var mtch = this.ValidationRegex.test(value);
                        if (!mtch) {
                            errors.push({ Code: 'REGEX', Message: "Validation failed for " + column.Configuration.Title });
                            return null;
                        }
                        return value;
                    }
                    if (value == null || value == undefined || value.length === 0) {
                        if (!column.Configuration.IsNullable && (!column.IsString)) {
                            errors.push({ Code: 'NULL', Message: column.Configuration.Title + " value is mandatory" });
                            return null;
                        }
                        if (column.IsString && !this.Configuration.AllowEmptyString) {
                            errors.push({ Code: 'EMPTYSTRING', Message: column.Configuration.Title + " must not be an empty string" });
                            return null;
                        }
                        return '';
                    }
                    if (this.Configuration.MaxAllowedLength > 0) {
                        if (value.length > this.Configuration.MaxAllowedLength) {
                            errors.push({ Code: 'MAXCHARS', Message: "Maximum " + column.Configuration.Title + " length exceeded" });
                            return null;
                        }
                    }
                    var i;
                    if (column.IsInteger || column.IsEnum) {
                        value = value.replace(this._removeSeparators, '');
                        i = parseInt(value);
                        if (isNaN(i)) {
                            errors.push({ Code: 'NONINT', Message: "Invalid number provided for " + column.Configuration.Title });
                            return null;
                        }
                        return i;
                    }
                    if (column.IsFloat) {
                        var negative = (value.length > 0 && value.charAt(0) === '-');
                        value = negative ? value.substring(1) : value;
                        value = value.replace(this._removeSeparators, '');
                        value = value.replace(this._dotSeparators, '.');
                        i = parseFloat(negative ? ('-' + value) : value);
                        if (isNaN(i) || (!this._floatRegex.test(value))) {
                            errors.push({ Code: 'NONFLOAT', Message: "Invalid number provided for " + column.Configuration.Title });
                            return null;
                        }
                        return i;
                    }
                    if (column.IsBoolean) {
                        var bs = value.toUpperCase().trim();
                        if (bs === 'TRUE')
                            return true;
                        if (bs === 'FALSE')
                            return false;
                        errors.push({ Code: 'NONBOOL', Message: "Invalid boolean value provided for " + column.Configuration.Title });
                        return null;
                    }
                    return value;
                };
                PlainTextEditor.prototype.defaultFormat = function (value, column) {
                    if (value == null || value == undefined)
                        return '';
                    return value.toString();
                };
                PlainTextEditor.prototype.changedHandler = function (e) {
                    _super.prototype.changedHandler.call(this, e);
                };
                PlainTextEditor.prototype.renderContent = function (templatesProvider) {
                    return this.defaultRender(templatesProvider);
                };
                PlainTextEditor.prototype.focus = function () {
                    this.Input.focus();
                    this.Input.setSelectionRange(0, this.Input.value.length);
                };
                return PlainTextEditor;
            }(Editors.CellEditorBase));
            Editors.PlainTextEditor = PlainTextEditor;
            PowerTables.ComponentsContainer.registerComponent('PlainTextEditor', PlainTextEditor);
        })(Editors = Plugins.Editors || (Plugins.Editors = {}));
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=../../../../../../PowerTables.Mvc/Scripts/pt/PowerTables.Script/Scripts/PowerTables/Plugins/Editors/PlainTextEditor.js.map