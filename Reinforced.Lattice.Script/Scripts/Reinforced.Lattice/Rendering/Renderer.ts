module Reinforced.Lattice.Rendering {

    /**
     * Enity responsible for displaying table
     */
    export class Renderer implements ITemplatesProvider {
        constructor(rootId: string, prefix: string, masterTable: IMasterTable) {
            this._masterTable = masterTable;
            this._instances = masterTable.InstanceManager;
            this.RootElement = document.getElementById(rootId);
            this._rootId = rootId;
            this._events = masterTable.Events;
            this._prefix = prefix;
            this.Executor = Reinforced.Lattice.Templating._ltcTpl.executor(prefix, masterTable);
            this.BackBinder = new BackBinder(this._masterTable.Date);
        }

        private _columnsRenderFunctions: { [key: string]: (x: ICell) => string } = {};

        public Executor: Reinforced.Lattice.Templating.TemplatesExecutor;

        /**
         * Parent element for whole table
         */
        public RootElement: HTMLElement;

        /**
         * Parent element for table entries
         */
        public BodyElement: HTMLElement;

        /**
         * Locator of particular table parts in DOM
         */
        public Locator: DOMLocator;

        /**
         * BackBinder instance
         */
        public BackBinder: BackBinder;

        /**
         * Entity that is responsible for existing DOM modifications
         */
        public Modifier: DOMModifier;

        /**
         * API that is responsible for UI events delegation
         */
        public Delegator: Reinforced.Lattice.Services.EventsDelegatorService;

        private _masterTable: IMasterTable;
        private _instances: Reinforced.Lattice.Services.InstanceManagerService;
        private _rootId: string;
        private _events: Reinforced.Lattice.Services.EventsService;
        private _prefix: string;

        //#region Public methods
        /**
         * Perform table layout inside specified root element         
         */
        public layout(): void {
            this._events.LayoutRendered.invokeBefore(this, null);

            var rendered = this.Executor.executeLayout();
            this.RootElement.innerHTML = rendered.Html;

            var bodyMarker: Element = this.RootElement.querySelector('[data-track="tableBodyHere"]');
            if (!bodyMarker) throw new Error('Body placeholder is missing in table layout template');
            this.BodyElement = bodyMarker.parentElement;
            this.BodyElement.removeChild(bodyMarker);

            this.Locator = new DOMLocator(this.BodyElement, this.RootElement, this._rootId);
            this.Delegator = new Reinforced.Lattice.Services.EventsDelegatorService(this.Locator, this.BodyElement, this.RootElement, this._rootId, this._masterTable);
            this.BackBinder.Delegator = this.Delegator;
            this.Modifier = new DOMModifier(this.Executor, this.Locator, this.BackBinder, this._instances, this.Delegator, this.BodyElement);
            
            this.BackBinder.backBind(this.RootElement, rendered.BackbindInfo);
            this._events.LayoutRendered.invokeAfter(this, null);
        }

        /**
         * Clear dynamically loaded table content and replace it with new one
         * 
         * @param rows Set of table rows         
         */
        public body(rows: IRow[]): void {
            var process = this.Executor.beginProcess();
            for (var i: number = 0; i < rows.length; i++) {
                var rw: IRow = rows[i];
                Reinforced.Lattice.Templating.Driver.row(process, rw);
            }
            var result = this.Executor.endProcess(process);

            this.Delegator.handleElementDestroy(this.BodyElement);
            this.BodyElement.innerHTML = result.Html;
            this.BackBinder.backBind(this.BodyElement, result.BackbindInfo);
            this._events.DataRendered.invokeAfter(this, null);
        }

        public renderObjectContent(renderable: IRenderable): string {
            var p = this.Executor.beginProcess();
            p.nestContent(renderable, null);
            return this.Executor.endProcess(p).Html;
        }

        public renderToString(templateId: string, viewModelBehind: any): string {
            var result = this.Executor.execute(viewModelBehind, templateId);
            return result.Html;
        }
        public renderObject(templateId: string, viewModelBehind: any, targetSelector: string): HTMLElement {
            var parent = <HTMLElement>document.querySelector(targetSelector);
            return this.renderObjectTo(templateId, viewModelBehind, parent);
        }

        public renderObjectTo(templateId: string, viewModelBehind: any, target: HTMLElement): HTMLElement {
            var result = this.Executor.execute(viewModelBehind, templateId);
            var parser: Rendering.Html2Dom.HtmlParser = new Rendering.Html2Dom.HtmlParser();
            var element = parser.html2DomElements(result.Html);
            target.innerHTML = '';
            for (var i = 0; i < element.length; i++) {
                target.appendChild(element[i]);
            }
            this.BackBinder.backBind(target, result.BackbindInfo);
            return target;
        }

        /**
         * Removes all dynamically loaded content in table
         * 
         * @returns {} 
         */
        public clearBody(): void {
            if (this.Delegator) {
                this.Delegator.handleElementDestroy(this.BodyElement);
            }
            this.BodyElement.innerHTML = '';
        }

        //#endregion
    }
}