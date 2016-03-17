var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var SelectFilter = (function (_super) {
        __extends(SelectFilter, _super);
        function SelectFilter(column) {
            _super.call(this, 'pt-selectfilter', column);
            this._filteringIsBeingExecuted = false;
            if (this.Configuration.AllowSelectNothing) {
                var nothingItem = { Value: '', Text: this.Configuration.NothingText || '-', Disabled: false, Selected: false };
                this.Configuration.Items =
                    [nothingItem].concat(this.Configuration.Items);
            }
            var sv = this.Configuration.SelectedValue;
            if (sv !== undefined && sv !== null) {
                for (var i = 0; i < this.Configuration.Items.length; i++) {
                    if (this.Configuration.Items[i].Value !== sv) {
                        this.Configuration.Items[i].Selected = false;
                    }
                    else {
                        this.Configuration.Items[i].Selected = true;
                    }
                }
            }
        }
        SelectFilter.prototype.subscribeEvents = function (parentElement) {
            var _self = this;
            this._selectElement = parentElement.find("select[data-for='" + this.Column.RawName + "']");
            this._selectElement.change(function (e) {
                _self.handleValueChanged();
            });
        };
        SelectFilter.prototype.handleValueChanged = function () {
            this.Table.reload();
        };
        SelectFilter.prototype.getArgument = function () {
            if (this._selectElement) {
                if (!this.Configuration.IsMultiple) {
                    var v = this._selectElement.val();
                    return v;
                }
                else {
                    var elemValues = [];
                    this._selectElement.find('option:selected').each(function () {
                        elemValues.push($(this).val());
                    });
                    return elemValues.join('|');
                }
            }
            return '';
        };
        SelectFilter.prototype.reset = function () {
            if (this._selectElement) {
                this._selectElement.find('option:selected').removeAttr('selected');
            }
        };
        return SelectFilter;
    })(PowerTables.FilterBase);
    PowerTables.SelectFilter = SelectFilter;
    PowerTables.ComponentsContainer.registerComponent('SelectFilter', SelectFilter);
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=SelectFilter.js.map