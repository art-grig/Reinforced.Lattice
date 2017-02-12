declare module PowerTables.Rendering {
    /**
     * Component for managing components visual states
     */
    class VisualState {
        constructor();
        States: {
            [key: string]: IState[];
        };
        /**
         * Current visual state
         */
        Current: string;
        private _subscribers;
        private _stopEvents;
        /**
         * Subscribes specified function to state change events
         *
         * @param fn Function that will be called when state changes
         */
        subscribeStateChange(fn: (evt: IStateChangedEvent) => void): void;
        private fireHandlers(e);
        /**
         * Applies settings for specified state
         *
         * @param state State id
         * @param states VisualStates collection
         */
        changeState(state: string): void;
        /**
         * Mixins settings for specified state
         *
         * @param state State id
         * @param states VisualStates collection
         */
        mixinState(state: string): void;
        /**
         * Unmixins state of current state
         *
         * @param state State to unmixin
         * @returns {}
         */
        unmixinState(state: string): void;
        /**
         * Reverts elements back to normal state
         *
         * @param states VisualStates collection
         */
        normalState(): void;
        private applyState(desired);
        private getContent(receiver, contentLocation);
        private setNormal();
    }
    interface IStateChangedEvent {
        State: string;
        CurrentState: string;
        StateWasMixedIn: boolean;
    }
}
