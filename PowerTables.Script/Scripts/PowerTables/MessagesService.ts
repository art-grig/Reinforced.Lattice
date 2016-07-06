module PowerTables {

    /**
     * Class responsible for handling of table messages. It handles internally thrown messages as well as 
     * user's ones
     */
    export class MessagesService {

        /*
         * @internal
         */
        constructor(usersMessageFn: (msg: ITableMessage) => void, instances: InstanceManager, dataHolder: DataHolder, controller: Controller,templatesProvider:ITemplatesProvider) {
            this._usersMessageFn = usersMessageFn;
            this._instances = instances;
            this._dataHolder = dataHolder;
            this._controller = controller;
            this._templatesProvider = templatesProvider;
            if (!usersMessageFn) {
                this._usersMessageFn = (m) => { alert(m.Title + '\r\n' + m.Details); };
            }
        }

        private _usersMessageFn: (msg: ITableMessage) => void;
        private _instances: InstanceManager;
        private _dataHolder: DataHolder;
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
            if (!this._templatesProvider.hasCachedTemplate(`ltmsg-${tableMessage.Class}`)) {
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
    }
} 