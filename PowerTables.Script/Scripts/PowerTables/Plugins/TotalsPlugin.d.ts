declare module PowerTables.Plugins {
    class TotalsPlugin extends PluginBase<Plugins.Total.ITotalClientConfiguration> {
        private _totalsForColumns;
        private makeTotalsRow();
        onResponse(e: ITableEventArgs<IDataEventArgs>): void;
        onClientRowsRendering(e: ITableEventArgs<IRow[]>): void;
        private onAdjustments(e);
        onClientDataProcessed(e: ITableEventArgs<IClientDataResults>): void;
        subscribe(e: EventsManager): void;
    }
}
