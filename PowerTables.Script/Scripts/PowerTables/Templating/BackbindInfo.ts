module PowerTables.Templating {
    export interface IBackbindInfo {
        EventsQueue: IEventDescriptor[];
        MarkQueue: IMarkDescriptor[];
        DatepickersQueue: IDatepickerDescriptor[];
        CallbacksQueue: ICallbackDescriptor[];
        DestroyCallbacksQueue: ICallbackDescriptor[];
        CachedVisualStates: { [key: string]: IState[] };
        HasVisualStates:boolean;
    }

    /**
    * @internal
    */
    export interface IMarkDescriptor {
        ElementReceiver: any;
        FieldName: string;
        Key: any;
    }

    /**
   * @internal
   */
    export interface IDatepickerDescriptor {
        ElementReceiver: any;
        IsNullable: boolean;
    }

    /**
   * @internal
   */
    export interface ICallbackDescriptor {
        Element?: HTMLElement;
        Callback: any; // function or function name
        CallbackArguments: any[];
        Target: any;
    }

    /**
     * Descriptor for event from events queue
     */
    export interface IEventDescriptor {
        /**
         * Event target. 
         * Plugin, cell, header etc. Table entity that will receive event
         */
        EventReceiver: any;
        /**
         * Event handlers that will be called
         */
        Functions: string[];
        /**
         * DOM events that will trigger handler call
         */
        Events: string[];

        /**
         * Event argumetns
         */
        EventArguments: any[];
    }

    export interface IState {
        /**
         * HTML element this state is applicable to
         */
        Element: HTMLElement,

        /**
         * Object that owns mentioned HTML element
         */
        Receiver: any;

        /**
         * State ID
         */
        id: string;
        /**
         * Classes to add/remove
         */
        classes: string[];
        /**
         * Attributes values in desired state
         */
        attrs: { [key: string]: string };
        /**
         * Styles to be changed in desired state
         */
        styles: { [key: string]: string };
        /**
         * Element HTML content to be set in particular state
         */
        content: string;
    }

    
}