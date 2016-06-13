declare module PowerTables.Plugins {
    class LoadingOverlapPlugin extends PluginBase<PowerTables.Plugins.LoadingOverlap.ILoadingOverlapUiConfig> {
        private _overlappingElement;
        private _overlapLayer;
        private _isOverlapped;
        private overlapAll();
        private createOverlap(efor, templateId);
        private updateCoords(overlapLayer, overlapElement);
        private updateCoordsAll();
        private deoverlap();
        private onBeforeLoading(e);
        afterDrawn: (e: ITableEventArgs<any>) => void;
    }
}
