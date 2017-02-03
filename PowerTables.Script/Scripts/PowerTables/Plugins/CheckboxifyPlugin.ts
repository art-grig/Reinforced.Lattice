module PowerTables.Plugins.Checkboxify {
    export class CheckboxifyPlugin extends PowerTables.Plugins.PluginBase<PowerTables.Plugins.Checkboxify.ICheckboxifyUiConfig> {
        private _ourColumn: IColumn;

        private redrawHeader() {
            this._ourColumn.Header['IsAllSelected'] = this.MasterTable.Selection.isAllSelected();
            this._ourColumn.Header['CanSelectAll'] = this.MasterTable.Selection.canSelectAll();
            this.MasterTable.Renderer.Modifier.redrawHeader(this._ourColumn);
        }

        public init(masterTable: IMasterTable): void {
            super.init(masterTable);
            this._ourColumn = this.MasterTable.InstanceManager.Columns['_checkboxify'];
            var selectAll = (e) => this.MasterTable.Selection.toggleAll();
            var header: ISpecialHeader = {
                Column: this._ourColumn,
                renderContent: null,
                renderElement: null,
                TemplateIdOverride: this.Configuration.SelectAllTemplateId,
                selectAllEvent: (e) => this.MasterTable.Selection.toggleAll()
            }
            this._ourColumn.Header = header;
        }

        public subscribe(e: PowerTables.Services.EventsService): void {
            e.SelectionChanged.subscribeAfter(e => this.redrawHeader(), 'checkboxify');
            e.ClientDataProcessing.subscribeAfter(e => this.redrawHeader(), 'checkboxify');
            e.DataReceived.subscribeAfter(e => this.redrawHeader(), 'checkboxify');
        }
       
    }

    interface ISpecialHeader extends IColumnHeader {
        selectAllEvent(e: PowerTables.Rendering.ITemplateBoundEvent): void;
    }
    ComponentsContainer.registerComponent('Checkboxify', CheckboxifyPlugin);
} 