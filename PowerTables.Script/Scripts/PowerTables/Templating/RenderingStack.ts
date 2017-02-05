
module PowerTables.Templating {
    /**
     * Rendering stack class. Provives common helper 
     * infrastructure for context-oriented rendering
     * @internal
     */
    export class RenderingStack {
        private _contextStack: IRenderingContext[] = [];

        /**
         * Clears rendering stack 
         * @returns {} 
         */
        public clear() {
            this.Current = null;
            if (this._contextStack.length === 0) return;
            this._contextStack = [];
        }

        /**
         * Current rendering context
         */
        public Current: IRenderingContext = null;

        /**
         * Pushes rendering context into stack
         * @param ctx 
         * @returns {} 
         */
        public pushContext(ctx: IRenderingContext): void {
            this._contextStack.push(ctx);
            this.Current = ctx;
        }

        /**
         * Pushes rendering context into stack
         * @param elementType What is being rendered
         * @param element Reference to object is being rendered
         * @param columnName Optional column name - for column-contexted rendering objects
         * @returns {} 
         */
        public push(elementType: RenderedObject, element: IRenderable): void {
            var ctx: IRenderingContext = <IRenderingContext>{
                Type: elementType,
                Object: element,
                CurrentTrack: this.getTrack(elementType, element)
            }
            this._contextStack.push(ctx);
            this.Current = ctx;
        }

        private getTrack(elementType: RenderedObject, element: IRenderable): string {

            var trk: string;
            switch (elementType) {
            case RenderedObject.Plugin:
                trk = TrackHelper.getPluginTrack(<IPlugin>element);
                break;
            case RenderedObject.Header:
                trk = TrackHelper.getHeaderTrack((<IColumnHeader>element));
                break;
            case RenderedObject.Cell:
                trk = TrackHelper.getCellTrack(<any>element);
                break;
            case RenderedObject.Row:
                trk = TrackHelper.getRowTrack(<any>element);
                break;
            case RenderedObject.Message:
                trk = TrackHelper.getMessageTrack();
                break;
            case RenderedObject.Partition:
                trk = TrackHelper.getPartitionRowTrack();
                break;
            case RenderedObject.Custom:
                trk = 'custom';
                break;
            default:

                throw new Error('Invalid context element type');
            }
            return trk;
        }

        /**
         * Pops rendering context from stack
         * @returns {} 
         */
        public popContext(): void {
            this._contextStack.pop();
            if (this._contextStack.length === 0) this.Current = null;
            else this.Current = this._contextStack[this._contextStack.length - 1];
        }
    }

    /**
     * Denotes current rendering context
     */
    export interface IRenderingContext {
        /**
         * What is being rendered (Object type)
         */
        Type: RenderedObject;
        /**
         * Reference to object is being rendered
         */
        Object?: IRenderable;

        /**
         * Rendering object track attribute
         */
        CurrentTrack: string;
    }

}