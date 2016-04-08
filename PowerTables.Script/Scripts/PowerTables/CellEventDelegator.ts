module PowerTables {
    
    /**
     * Component responsible for handling of user events raised on table cells
     */
    export class CellEventDelegator {
        constructor(bodyRootElement: HTMLElement) {
            this._bodyRootElement = bodyRootElement;
        }

        private _bodyRootElement: HTMLElement;

    }
} 