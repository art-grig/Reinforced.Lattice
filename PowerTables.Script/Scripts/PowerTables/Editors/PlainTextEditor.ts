module PowerTables.Editors.PlainText {
    
    export class PlainTextEditor extends PowerTables.Editors.CellEditorBase<PowerTables.Editors.PlainText.IPlainTextEditorUiConfig> {
        Input: HTMLInputElement;
        ValidationRegex: RegExp;
        private _removeSeparators: RegExp;
        private _dotSeparators: RegExp;
        private _floatRegex: RegExp = new RegExp("^[0-9]+(\.[0-9]+)?$");

        private _formatFunction: (value: any, column: IColumn) => string;
        private _parseFunction: (value: string, column: IColumn, errors: IValidationMessage[]) => any;

        public getValue(errors: IValidationMessage[]): any {
            if (this.Column.IsDateTime) {
                var d = this.MasterTable.Date.getDateFromDatePicker(this.Input);
                if ((d == null) && !this.Column.Configuration.IsNullable) {
                    errors.push({ Code: 'NULL', Message: `${this.Column.Configuration.Title} value is mandatory` });
                    return null;
                }
                return d;
            } else {
                return this._parseFunction(this.Input.value, this.Column, errors);
            }

        }

        public setValue(value: any): void {
            if (this.Column.IsDateTime) {
                this.MasterTable.Date.putDateToDatePicker(this.Input, value);
            } else {
                this.Input.value = this._formatFunction(value, this.Column);
            }
        }


        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            if (this.Configuration.ValidationRegex) {
                this.ValidationRegex = new RegExp(this.Configuration.ValidationRegex);
            }
            this._dotSeparators = new RegExp(this.Configuration.FloatDotReplaceSeparatorsRegex);
            this._removeSeparators = new RegExp(this.Configuration.FloatRemoveSeparatorsRegex);

            this._parseFunction = this.Configuration.ParseFunction || this.defaultParse;
            this._formatFunction = this.Configuration.FormatFunction || this.defaultFormat;
        }


        private defaultParse(value: string, column: IColumn, errors: IValidationMessage[]): any {
            if (this.ValidationRegex) {
                var mtch = this.ValidationRegex.test(value);
                if (!mtch) {
                    errors.push({ Code: 'REGEX', Message: `Validation failed for ${column.Configuration.Title}` });
                    return null;
                }
                return value;
            }

            if (value == null || value == undefined || value.length === 0) {
                if (!column.Configuration.IsNullable && (!column.IsString)) {
                    errors.push({ Code: 'NULL', Message: `${column.Configuration.Title} value is mandatory` });
                    return null;
                }

                if (column.IsString && !this.Configuration.AllowEmptyString) {
                    errors.push({ Code: 'EMPTYSTRING', Message: `${column.Configuration.Title} must not be an empty string` });
                    return null;
                }
                return '';
            }
            if (this.Configuration.MaxAllowedLength > 0) {
                if (value.length > this.Configuration.MaxAllowedLength) {
                    errors.push({ Code: 'MAXCHARS', Message: `Maximum ${column.Configuration.Title} length exceeded` });
                    return null;
                }
            }
            var i;
            if (column.IsInteger || column.IsEnum) {
                value = value.replace(this._removeSeparators, '');

                i = parseInt(value);
                if (isNaN(i)) {
                    errors.push({ Code: 'NONINT', Message: `Invalid number provided for ${column.Configuration.Title}` });
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
                    errors.push({ Code: 'NONFLOAT', Message: `Invalid number provided for ${column.Configuration.Title}` });
                    return null;
                }
                return i;
            }

            if (column.IsBoolean) {
                var bs = value.toUpperCase().trim();
                if (bs === 'TRUE') return true;
                if (bs === 'FALSE') return false;
                errors.push({ Code: 'NONBOOL', Message: `Invalid boolean value provided for ${column.Configuration.Title}` });
                return null;
            }

            return value;
        }

        private defaultFormat(value: any, column: IColumn): string {
            if (value == null || value == undefined) return '';
            return value.toString();
        }

        public changedHandler(e: PowerTables.Rendering.ITemplateBoundEvent): void {
            super.changedHandler(e);
        }

        public renderContent(templatesProvider: ITemplatesProvider): string {
            return this.defaultRender(templatesProvider);
        }

        public focus(): void {
            this.Input.focus();
            this.Input.setSelectionRange(0, this.Input.value.length);
        }
    }

    ComponentsContainer.registerComponent('PlainTextEditor', PlainTextEditor);
} 