module PowerTables.Plugins.Editors {
    import PlainTextEditorUiConfig = PowerTables.Editors.PlainText.IPlainTextEditorUiConfig;

    export class PlainTextEditor extends CellEditorBase<PlainTextEditorUiConfig> {
        Input: HTMLElement;
        ValidationRegex: RegExp;
        private _removeSeparators: RegExp;
        private _dotSeparators: RegExp;
        
        private _formatFunction: (value: any, column: IColumn) => string;
        private _parseFunction: (value: string, column: IColumn, errors: string[]) => any;

        public getValue(errors: string[]): any {
            if (this.Column.IsDateTime) {
                this.MasterTable.Date.getDateFromDatePicker(this.Input);
            } else {
                this._parseFunction(this.Input.nodeValue, this.Column, errors);
            }
        }

        public setValue(value: any): void {
            if (this.Column.IsDateTime) {
                this.MasterTable.Date.putDateToDatePicker(this.Input, value);
            } else {
                this.Input.nodeValue = this._formatFunction(value, this.Column);
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


        private defaultParse(value: string, column: IColumn, errors: string[]): any {
            if (this.ValidationRegex) {
                var mtch = this.ValidationRegex.test(value);
                if (!mtch) {
                    errors.push(this.Configuration.RegexValidationErrorText);
                    return null;
                }
                return value;
            }

            if (value == null || value == undefined || value.length === 0) {
                if (!column.Configuration.IsNullable) {
                    errors.push(`Value should be provided for ${column.Configuration.Title}`);
                }
                return null;
            }

            var i;
            if (column.IsInteger || column.IsEnum) {
                value = value.replace(this._removeSeparators, '');

                i = parseInt(value);
                if (isNaN(i)) {
                    errors.push(`Invalid number provided for ${column.Configuration.Title}`);
                    return null;
                }
                return i;
            }

            if (column.IsFloat) {
                value = value.replace(this._removeSeparators, '');
                value = value.replace(this._dotSeparators, '.');

                i = parseFloat(value);
                if (isNaN(i)) {
                    errors.push(`Invalid number provided for ${column.Configuration.Title}`);
                    return null;
                }
                return i;
            }

            if (column.IsBoolean) {
                var bs = value.toUpperCase().trim();
                if (bs === 'TRUE') return true;
                if (bs === 'FALSE') return false;
                errors.push(`Invalid boolean value provided for ${column.Configuration.Title}`);
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
    }

    ComponentsContainer.registerComponent('PlainTextEditor', PlainTextEditor);
} 