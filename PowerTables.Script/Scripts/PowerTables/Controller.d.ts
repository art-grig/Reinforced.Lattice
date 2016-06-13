declare module PowerTables {
    /**
     * This entity is responsible for integration of data between storage and rendere.
     * Also it provides functionality for table events subscription and
     * elements location
     */
    class Controller {
        constructor(masterTable: IMasterTable);
        private _masterTable;
        /**
         * Initializes full reloading cycle
         * @returns {}
         */
        reload(forceServer?: boolean): void;
        /**
         * Redraws row containing currently visible data object
         *
         * @param dataObject Data object
         * @param idx
         * @returns {}
         */
        redrawVisibleDataObject(dataObject: any, idx?: number): HTMLElement;
        /**
         * Redraws locally visible data
         */
        redrawVisibleData(): void;
        drawAdjustmentResult(adjustmentResult: IAdjustmentResult): void;
        /**
         * Converts data object,row and column to cell
         *
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param column Column that this cell belongs to
         * @param row Row that this cell belongs to
         * @returns {ICell} Cell representing data
         */
        produceCell(dataObject: any, column: IColumn, row: IRow): ICell;
        /**
         * Converts data object to display row
         *
         * @param dataObject Data object
         * @param idx Object's displaying index
         * @param columns Optional displaying columns set
         * @returns {IRow} Row representing displayed object
         */
        produceRow(dataObject: any, idx: number, columns?: IColumn[]): IRow;
        private produceRows();
    }
    /**
     * Behavior of redrawing table after modification
     */
    enum RedrawBehavior {
        /**
         * To perform UI redraw, data will be entirely reloaded from server.
         * Local data will not be affected due to further reloading
         */
        ReloadFromServer = 0,
        /**
         * Filters will be reapplied only locally.
         * Currently displaying data will be entirely redrawn with client filters
         * using locally cached data from server.
         *
         * In this case, if modified rows are not satisfying any server conditions then
         * is will still stay in table. That may seem illogical for target users.
         */
        LocalFullRefresh = 1,
        /**
         * Filters will be reapplied locally but only on currently displaying data.
         *
         * In this case, deleted row will simply disappear, added row will be added to currently
         * displaying cells set and currently displaying set will be re-ordered, modified
         * row will be ordered among only displaying set without filtering.
         * This approach is quite fast and may be useful in various cases
         */
        LocalVisibleReorder = 2,
        /**
         * Simply redraw all the visible cells without additional filtering.
         *
         * May lead to glitches e.g. invalid elements count on page or invalid
         * items order. Most suitable for updating that does not touch filtering/ordering-sensetive
         * data.
         */
        RedrawVisible = 3,
        /**
         * Only particular row mentioned in modification request will be updated.
         * No server reloading, no reordering, no re-sorting. Row will stay in place or
         * will be added at specified position or will be simply disappear from currently displayed set.
         * In some cases such behavior may confuse users, but still stay suitable for most cases.
         * Of course, it will disappear after on next filtering if no more satisfying
         * filter conditions.
         */
        ParticularRowUpdate = 4,
        /**
         * Modification request will not affect UI anyhow until next filtering. Confusing.
         */
        DoNothing = 5,
    }
}
