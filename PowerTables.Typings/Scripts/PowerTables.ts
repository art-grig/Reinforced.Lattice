module PowerTables {
    /**
     * Main entry point for all tables functionality
     */
    export class PowerTable implements IInternalTable {

        /**
         * Events manager - entry point for raising and handling various table events
         */
        public Events: EventsManager = new EventsManager();
    }
} 