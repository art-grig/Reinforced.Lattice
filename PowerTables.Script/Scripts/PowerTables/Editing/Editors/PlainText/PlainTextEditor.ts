module PowerTables.Editing.Editors.PlainText {
    
    export class PlainTextEditor extends PowerTables.Editing.EditorBase<PowerTables.Editing.Editors.PlainText.IPlainTextEditorUiConfig> {
        Input: HTMLInputElement;
        ValidationRegex: RegExp;
        private _removeSeparators: RegExp;
        private _dotSeparators: RegExp;
        private _floatRegex: RegExp = new RegExp("^[0-9]+(\.[0-9]+)?$");

        private _formatFunction: (value: any, column: IColumn) => string;
        private _parseFunction: (value: string, column: IColumn, errors: PowerTables.Editing.IValidationMessage[]) => any;

        public getValue(errors: PowerTables.Editing.IValidationMessage[]): any {
            if (this.Column.IsDateTime) {
                var d = this.MasterTable.Date.getDateFromDatePicker(this.Input);
                if ((d == null) && !this.Column.Configuration.IsNullable) {
                    errors.push({ Code: 'NULL' });
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


        private defaultParse(value: string, column: IColumn, errors: PowerTables.Editing.IValidationMessage[]): any {
            if (this.ValidationRegex) {
                var mtch = this.ValidationRegex.test(value);
                if (!mtch) {
                    errors.push({ Code: 'REGEX' });
                    return null;
                }
                return value;
            }

            if (value == null || value == undefined || value.length === 0) {
                if (!column.Configuration.IsNullable && (!column.IsString)) {
                    errors.push({ Code: 'NULL' });
                    return null;
                }

                if (column.IsString && !this.Configuration.AllowEmptyString) {
                    errors.push({ Code: 'EMPTYSTRING' });
                    return null;
                }
                return '';
            }
            if (this.Configuration.MaxAllowedLength > 0) {
                if (value.length > this.Configuration.MaxAllowedLength) {
                    errors.push({ Code: 'MAXCHARS' });
                    return null;
                }
            }
            var i;
            if (column.IsInteger || column.IsEnum) {
                value = value.replace(this._removeSeparators, '');

                i = parseInt(value);
                if (isNaN(i)) {
                    errors.push({ Code: 'NONINT' });
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
                    errors.push({ Code: 'NONFLOAT' });
                    return null;
                }
                return i;
            }

            if (column.IsBoolean) {
                var bs = value.toUpperCase().trim();
                if (bs === 'TRUE') return true;
                if (bs === 'FALSE') return false;
                errors.push({ Code: 'NONBOOL' });
                return null;
            }

            return value;
        }

        private defaultFormat(value: any, column: IColumn): string {
            if (value == null || value == undefined) return '';
            return value.toString();
        }

        public changedHandler(e: PowerTables.ITemplateBoundEvent): void {
            super.changedHandler(e);
        }

        public renderContent(p: PowerTables.Templating.TemplateProcess): void {
            this.defaultRender(p);
        }

        public focus(): void {
            this.Input.focus();
            this.Input.setSelectionRange(0, this.Input.value.length);
        }

        defineMessages(): { [key: string]: string } {
            return {
                'NONBOOL': `Invalid boolean value provided for ${this.Column.Configuration.Title}`,
                'NONFLOAT': `Invalid number provided for ${this.Column.Configuration.Title}`,
                'NONINT': `Invalid number provided for ${this.Column.Configuration.Title}`,
                'MAXCHARS': `Maximum ${this.Column.Configuration.Title} length exceeded`,
                'EMPTYSTRING': `${this.Column.Configuration.Title} must not be an empty string`,
                'NULL': `${this.Column.Configuration.Title} value is mandatory`,
                'REGEX': `Validation failed for ${this.Column.Configuration.Title}`,
            }
        }
    }

    ComponentsContainer.registerComponent('PlainTextEditor', PlainTextEditor);
} 