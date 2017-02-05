module PowerTables.Services {

    /**
     * Class responsible for handling of table messages. It handles internally thrown messages as well as 
     * user's ones
     */
    export class MessagesService implements IAdditionalRowsProvider {

        /*
         * @internal
         */
        constructor(usersMessageFn: (msg: ITableMessage) => void, instances: PowerTables.Services.InstanceManagerService, dataHolder: PowerTables.Services.DataHolderService, controller: Controller, templatesProvider: ITemplatesProvider) {
            this._usersMessageFn = usersMessageFn;
            this._instances = instances;
            this._dataHolder = dataHolder;
            this._controller = controller;
            this._templatesProvider = templatesProvider;
            if (!usersMessageFn) {
                this._usersMessageFn = (m) => { alert(m.Title + '\r\n' + m.Details); };
            }
            this._controller.registerAdditionalRowsProvider(this);
        }

        private _usersMessageFn: (msg: ITableMessage) => void;
        private _instances: PowerTables.Services.InstanceManagerService;
        private _dataHolder: PowerTables.Services.DataHolderService;
        private _controller: Controller;
        private _templatesProvider: ITemplatesProvider;

        /**
         * Shows table message according to its settings
         * @param message Message of type ITableMessage
         * @returns {} 
         */
        public showMessage(message: ITableMessage) {
            if (message.Type === MessageType.UserMessage) {
                this._usersMessageFn(message);
            } else {
                this.showTableMessage(<IUiMessage>message);
            }
        }

        private showTableMessage(tableMessage: IUiMessage) {
            if (!this._templatesProvider.Executor.hasTemplate(`ltmsg-${tableMessage.Class}`)) {
                this._controller.replaceVisibleData([]);
                return;
            }

            var msgRow: IRow = {
                DataObject: tableMessage,
                IsSpecial: true,
                TemplateIdOverride: `ltmsg-${tableMessage.Class}`,
                MasterTable: null, /*todo*/
                Index: 0,
                Cells: {}
            }
            tableMessage.UiColumnsCount = this._instances.getUiColumns().length;
            tableMessage.IsMessageObject = true;
            this._controller.replaceVisibleData([msgRow]);
        }

        private _noresultsOverrideRow:IRow = null;
        public overrideNoresults(row:IRow) {
            this._noresultsOverrideRow = row;
        }

        public provide(rows: IRow[]): void {
            
            if (rows.length === 0) {
                if (this._noresultsOverrideRow != null) {
                    rows.push(this._noresultsOverrideRow);
                    return;
                }
                var message: IUiMessage = {
                    Class: 'noresults',
                    Title: 'No data found',
                    Details: 'Try specifying different filter settings',
                    Type: MessageType.Banner,
                    UiColumnsCount: this._instances.getUiColumns().length,
                    IsMessageObject: true
                }
                var msgRow: IRow = {
                    DataObject: message,
                    IsSpecial: true,
                    TemplateIdOverride: `ltmsg-${message.Class}`,
                    MasterTable: null, /*todo*/
                    Index: 0,
                    Cells: {}
                }
                rows.push(msgRow);
            }
        }
    }
} 