var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        /**
         * Enity responsible for displaying table
         */
        var Renderer = (function () {
            function Renderer(rootId, prefix, isColumnDateTimeFunc, instances) {
                this._templatesCache = {};
                this._isColumnDateTimeFunc = isColumnDateTimeFunc;
                this._instances = instances;
                this._stack = new Rendering.RenderingStack();
                this.RootElement = document.getElementById(rootId);
                this.HandlebarsInstance = Handlebars.create();
                this._layoutRenderer = new Rendering.LayoutRenderer(this, this._stack, this._instances);
                this._contentRenderer = new Rendering.ContentRenderer(this, this._stack, this._instances);
                this.HandlebarsInstance.registerHelper("ifq", this.ifqHelper);
                this.HandlebarsInstance.registerHelper('Content', this.contentHelper.bind(this));
                this.HandlebarsInstance.registerHelper('Track', this.trackHelper.bind(this));
                this.HandlebarsInstance.registerHelper('Datepicker', this.datepickerHelper.bind(this));
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
                var rendered = this.getCachedTemplate('layout')(null);
                this.RootElement.innerHTML = rendered;
                var bodyMarker = this.RootElement.querySelector('[data-track="tableBodyHere"]');
                if (!bodyMarker)
                    throw new Error('{{Body}} placeholder is missing in table layout template');
                this.BodyElement = bodyMarker.parentElement;
                this.BodyElement.removeChild(bodyMarker);
                this._layoutRenderer.bindEventsQueue(this.RootElement);
            };
            /**
             * Clear dynamically loaded table content and replace it with new one
             *
             * @param rows Set of table rows
             */
            Renderer.prototype.body = function (rows) {
                this.clearBody();
                this.BodyElement.innerHTML = this._contentRenderer.renderBody(rows);
            };
            Renderer.prototype.clearBody = function () {
                this.BodyElement.innerHTML = '';
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
            Renderer.prototype.datepickerHelper = function () {
                if (this._stack.Current.Type === Rendering.RenderingContextType.Plugin) {
                    if (this._isColumnDateTimeFunc(this._stack.Current.ColumnName)) {
                        return 'data-dp="true"';
                    }
                    else {
                        return '';
                    }
                }
                else {
                    return '';
                }
            };
            Renderer.prototype.ifqHelper = function (a, b, opts) {
                if (a == b)
                    return opts.fn(this);
                else
                    return opts.inverse(this);
            };
            return Renderer;
        })();
        Rendering.Renderer = Renderer;
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=Renderer.js.map