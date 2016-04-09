/// <reference path="TrackHelper.ts"/>

module PowerTables.Rendering {
    /**
     * Rendering stack class. Provives common helper 
     * infrastructure for context-oriented rendering
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
        public push(elementType: RenderingContextType, element: IRenderable, columnName: string = ''): void {
            var ctx = <IRenderingContext>{
                Type: elementType,
                Object: element,
                ColumnName: columnName,
                CurrentTrack: this.getTrack(elementType,element)
            }
            this._contextStack.push(ctx);
            this.Current = ctx;
        }

        private getTrack(elementType: RenderingContextType, element: IRenderable): string {
            
            var trk;
            switch (elementType) {
            case RenderingContextType.Plugin:
                trk = TrackHelper.getPluginTrack(<IPlugin>element);
                break;
            case RenderingContextType.Header:
                trk = TrackHelper.getHeaderTrack((<IColumnHeader>element));
                break;
            case RenderingContextType.Cell:
                trk = TrackHelper.getCellTrack(<any>element);
                break;
            case RenderingContextType.Row:
                trk = TrackHelper.getRowTrack(<any>element);
                break;
            default:
                throw new Error("Invalid context element type");
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
        Type: RenderingContextType;
        /**
         * Reference to object is being rendered
         */
        Object?: IRenderable;
        
        /**
         * Optional column name - for column-contexted rendering objects
         */
        ColumnName?: string;

        /**
         * Rendering object track attribute
         */
        CurrentTrack:string;
    }

    /**
     * What renders in current helper method
     */
    export enum RenderingContextType {
        /**
         * Plugin (0)
         */
        Plugin,
        /**
         * Column header (1)
         */
        Header,
        /**
         * Row (containing cells) (2)
         */
        Row,
        /**
         * Cell (belonging to row and column) (3)
         */
        Cell
        
    }
} 