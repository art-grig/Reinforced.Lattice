var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        /**
         * Enity responsible for displaying table
         */
        var Renderer = (function () {
            function Renderer(rootId, prefix, instances, events) {
                this._templatesCache = {};
                this._instances = instances;
                this._stack = new Rendering.RenderingStack();
                this.RootElement = document.getElementById(rootId);
                this._rootId = rootId;
                this._events = events;
                this.HandlebarsInstance = Handlebars.create();
                this._layoutRenderer = new Rendering.LayoutRenderer(this, this._stack, this._instances);
                this._contentRenderer = new Rendering.ContentRenderer(this, this._stack, this._instances);
                this.BackBinder = new Rendering.BackBinder(this.HandlebarsInstance, instances, this._stack);
                this.HandlebarsInstance.registerHelper("ifq", this.ifqHelper);
                this.HandlebarsInstance.registerHelper("ifloc", this.iflocHelper.bind(this));
                this.HandlebarsInstance.registerHelper('Content', this.contentHelper.bind(this));
                this.HandlebarsInstance.registerHelper('Track', this.trackHelper.bind(this));
                this.cacheTemplates(prefix);
            }
            //#region Templates caching
            Renderer.prototype.cacheTemplates = function (templatesPrefix) {
                var selector = "script[type=\"text/x-handlebars-template\"][id^=\"" + templatesPrefix + "-\"]";
                var templates = document.querySelectorAll(selector);
                for (var i = 0; i < templates.length; i++) {
                    var item = templates.item(i);
                    var key = item.id.substring(templatesPrefix.length + 1);
                    this._templatesCache[key] = this.HandlebarsInstance.compile(item.innerHTML);
                }
            };
            /**
             * Retrieves cached template handlebars function
             * @param Template Id
             * @returns Handlebars function
             */
            Renderer.prototype.getCachedTemplate = function (templateId) {
                if (!this._templatesCache.hasOwnProperty(templateId))
                    throw new Error("Cannot find template " + templateId);
                return this._templatesCache[templateId];
            };
            //#endregion
            //#region Public methods
            /**
             * Perform table layout inside specified root element
             */
            Renderer.prototype.layout = function () {
                this._events.BeforeLayoutRendered.invoke(this, null);
                var rendered = this.getCachedTemplate('layout')(null);
                this.RootElement.innerHTML = rendered;
                var bodyMarker = this.RootElement.querySelector('[data-track="tableBodyHere"]');
                if (!bodyMarker)
                    throw new Error('{{Body}} placeholder is missing in table layout template');
                this.BodyElement = bodyMarker.parentElement;
                this.BodyElement.removeChild(bodyMarker);
                this.BackBinder.backBind(this.RootElement);
                this.Locator = new Rendering.DOMLocator(this.BodyElement, this.RootElement, this._rootId);
                this._events.AfterLayoutRendered.invoke(this, null);
            };
            /**
             * Clear dynamically loaded table content and replace it with new one
             *
             * @param rows Set of table rows
             */
            Renderer.prototype.body = function (rows) {
                this._events.BeforeClientRowsRendering.invoke(this, rows);
                this.clearBody();
                var html = this._contentRenderer.renderBody(rows);
                this.BodyElement.innerHTML = html;
                this._events.AfterDataRendered.invoke(this, null);
            };
            /**
             * Redraws specified plugin refreshing all its graphical state
             *
             * @param plugin Plugin to redraw
             * @returns {}
             */
            Renderer.prototype.redrawPlugin = function (plugin) {
                this._stack.clear();
                var oldPluginElement = this.Locator.getPluginElement(plugin);
                var parent = oldPluginElement.parentElement;
                var parser = new PowerTables.Rendering.Html2Dom.HtmlParser();
                var html = this._layoutRenderer.renderPlugin(plugin);
                var newPluginElement = parser.html2Dom(html);
                parent.replaceChild(newPluginElement, oldPluginElement);
                this.BackBinder.backBind(newPluginElement);
            };
            /**
             * Redraws specified row refreshing all its graphical state
             *
             * @param row
             * @returns {}
             */
            Renderer.prototype.redrawRow = function (row) {
                this._stack.clear();
                var wrapper = this.getCachedTemplate('rowWrapper');
                var html;
                if (row.renderElement) {
                    html = row.renderElement(this);
                }
                else {
                    html = wrapper(row);
                }
                var oldElement = this.Locator.getRowElement(row);
                this.replaceElement(oldElement, html);
            };
            /**
             * Redraws specified row refreshing all its graphical state
             *
             * @param row
             * @returns {}
             */
            Renderer.prototype.appendRow = function (row, afterRowAtIndex) {
                this._stack.clear();
                var wrapper = this.getCachedTemplate('rowWrapper');
                var html;
                if (row.renderElement) {
                    html = row.renderElement(this);
                }
                else {
                    html = wrapper(row);
                }
                var referenceNode = this.Locator.getRowElementByIndex(afterRowAtIndex);
                var newRowElement = this.createElement(html);
                referenceNode.parentNode.insertBefore(newRowElement, referenceNode.nextSibling);
            };
            /**
             * Removes referenced row by its index
             *
             * @param rowDisplayIndex
             * @returns {}
             */
            Renderer.prototype.removeRowByIndex = function (rowDisplayIndex) {
                var referenceNode = this.Locator.getRowElementByIndex(rowDisplayIndex);
                referenceNode.parentElement.removeChild(referenceNode);
            };
            /**
             * Redraws header for specified column
             *
             * @param column Column which header is to be redrawn
             */
            Renderer.prototype.redrawHeader = function (column) {
                this._stack.clear();
                var html = this._layoutRenderer.renderHeader(column);
                var oldHeaderElement = this.Locator.getHeaderElement(column.Header);
                var newElement = this.replaceElement(oldHeaderElement, html);
                this.BackBinder.backBind(newElement.parentElement);
            };
            Renderer.prototype.createElement = function (html) {
                var parser = new PowerTables.Rendering.Html2Dom.HtmlParser();
                return parser.html2Dom(html);
            };
            Renderer.prototype.replaceElement = function (element, html) {
                var node = this.createElement(html);
                element.parentElement.replaceChild(node, element);
                return node;
            };
            /**
             * Removes all dynamically loaded content in table
             *
             * @returns {}
             */
            Renderer.prototype.clearBody = function () {
                //this.BodyElement.innerHTML = '';
                while (this.BodyElement.firstChild) {
                    this.BodyElement.removeChild(this.BodyElement.firstChild);
                }
            };
            //#endregion
            //#region Helpers
            Renderer.prototype.contentHelper = function (columnName) {
                if (this._stack.Current.Object.renderContent) {
                    return this._stack.Current.Object.renderContent(this);
                }
                else {
                    switch (this._stack.Current.Type) {
                        case Rendering.RenderingContextType.Header:
                        case Rendering.RenderingContextType.Plugin:
                            return this._layoutRenderer.renderContent(columnName);
                        case Rendering.RenderingContextType.Row:
                        case Rendering.RenderingContextType.Cell:
                            return this._contentRenderer.renderContent(columnName);
                        default:
                            throw new Error("Unknown rendering context type");
                    }
                }
            };
            Renderer.prototype.trackHelper = function () {
                var trk = this._stack.Current.CurrentTrack;
                if (trk.length === 0)
                    return '';
                return "data-track=\"" + trk + "\"";
            };
            Renderer.prototype.ifqHelper = function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            };
            Renderer.prototype.iflocHelper = function (location, opts) {
                if (this._stack.Current.Type === Rendering.RenderingContextType.Plugin) {
                    var loc = this._stack.Current.Object.PluginLocation;
                    if (loc.length < location.length)
                        return opts.inverse(this);
                    if (loc.length === location.length && loc === location)
                        return opts.fn(this);
                    if (loc.substring(0, location.length) === location)
                        return opts.fn(this);
                }
                return opts.inverse(this);
            };
            return Renderer;
        })();
        Rendering.Renderer = Renderer;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Renderer.js.map