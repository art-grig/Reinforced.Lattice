declare module PowerTables.Plugins {
    class ToolbarConfirmation {
        constructor(confirm: (form: any) => void, reject: () => void, date: DateService, autoform: PowerTables.Plugins.Formwatch.IFormwatchFieldData[]);
        private _autoform;
        private _confirm;
        private _reject;
        private _date;
        private _beforeConfirm;
        AfterConfirm: ((form: any) => void)[];
        private _beforeReject;
        AfterReject: ((form: any) => void)[];
        AfterConfirmationResponse: ((form: any) => void)[];
        ConfirmationResponseError: ((form: any) => void)[];
        Form: any;
        RootElement: HTMLElement;
        SelectedItems: string[];
        SelectedObjects: any[];
        onRender(parent: HTMLElement): void;
        fireEvents(form: any, array: ((form: any) => void)[]): void;
        private collectFormData();
        confirmHandle(): void;
        dismissHandle(): void;
        onBeforeConfirm(fn: (form: any) => void): void;
        onAfterConfirm(fn: (form: any) => void): void;
        onBeforeReject(fn: (form: any) => void): void;
        onAfterReject(fn: (form: any) => void): void;
        onAfterConfirmationResponse(fn: (form: any) => void): void;
        onConfirmationResponseError(fn: (form: any) => void): void;
    }
}
