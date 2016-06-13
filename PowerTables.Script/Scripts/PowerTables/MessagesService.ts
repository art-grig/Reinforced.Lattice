module PowerTables {

    /**
     * Class responsible for handling of table messages. It handles internally thrown messages as well as 
     * user's ones
     */
    export class MessagesService {

        /*
         * @internal
         */
        constructor(usersMessageFn: (msg: ITableMessage) => void, instances: InstanceManager, dataHolder: DataHolder, controller: Controller) {
            this._usersMessageFn = usersMessageFn;
            this._instances = instances;
            this._dataHolder = dataHolder;
            this._controller = controller;
            if (!usersMessageFn) {
                this._usersMessageFn = (m) => { alert(m.Title + '\r\n' + m.Details); };
            }
        }

        private _usersMessageFn: (msg: ITableMessage) => void;
        private _instances: InstanceManager;
        private _dataHolder: DataHolder;
        private _controller: Controller;

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
            tableMessage.UiColumnsCount = this._instances.getUiColumns().length;
            tableMessage.IsMessageObject = true;
            this._dataHolder.DisplayedData = [tableMessage];
            this._controller.redrawVisibleData();
        }
    }
} 