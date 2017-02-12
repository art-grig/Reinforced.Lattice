declare module PowerTables {
    class MessagesService {
        constructor(usersMessageFn: (msg: ITableMessage) => void, instances: InstanceManager, dataHolder: DataHolder, controller: Controller);
        private _usersMessageFn;
        private _instances;
        private _dataHolder;
        private _controller;
        /**
         * Shows table message according to its settings
         * @param message Message of type ITableMessage
         * @returns {}
         */
        showMessage(message: ITableMessage): void;
        private showTableMessage(tableMessage);
    }
}
