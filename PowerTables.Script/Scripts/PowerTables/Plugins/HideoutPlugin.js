var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PowerTables;
(function (PowerTables) {
    var Plugins;
    (function (Plugins) {
        var HideoutPlugin = (function (_super) {
            __extends(HideoutPlugin, _super);
            function HideoutPlugin() {
                _super.apply(this, arguments);
                this.ColumnStates = [];
                this._columnStates = {};
                this._isInitializing = true;
                this.displayCache = {};
            }
            HideoutPlugin.prototype.isColumnVisible = function (columnName) {
                return this.isColumnInstanceVisible(this.MasterTable.InstanceManager.Columns[columnName]);
            };
            HideoutPlugin.prototype.isColumnInstanceVisible = function (col) {
                if (!col)
                    return true;
                return this._columnStates[col.RawName].Visible;
            };
            HideoutPlugin.prototype.hideColumnByName = function (rawColname) {
                this.hideColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
            };
            HideoutPlugin.prototype.showColumnByName = function (rawColname) {
                this.showColumnInstance(this.MasterTable.InstanceManager.Columns[rawColname]);
            };
            //#region Events handling
            HideoutPlugin.prototype.toggleColumn = function (e) {
                e.Receiver.toggleColumnByName(e.EventArguments[0]);
            };
            HideoutPlugin.prototype.showColumn = function (e) {
                e.Receiver.showColumnByName(e.EventArguments[0]);
            };
            HideoutPlugin.prototype.hideColumn = function (e) {
                e.Receiver.hideColumnByName(e.EventArguments[0]);
            };
            //#endregion
            //#region Correct showing/hiding
            HideoutPlugin.prototype.getRealDisplay = function (elem) {
                if (elem.currentStyle)
                    return elem.currentStyle.display;
                else if (window.getComputedStyle) {
                    var computedStyle = window.getComputedStyle(elem, null);
                    return computedStyle.getPropertyValue('display');
                }
                return '';
            };
            HideoutPlugin.prototype._hideElement = function (el) {
                if (!el)
                    return;
                if (!el.getAttribute('displayOld'))
                    el.setAttribute("displayOld", el.style.display);
                el.style.display = "none";
            };
            HideoutPlugin.prototype._showElement = function (el) {
                if (!el)
                    return;
                if (this.getRealDisplay(el) !== 'none')
                    return;
                var old = el.getAttribute("displayOld");
                el.style.display = old || "";
                if (this.getRealDisplay(el) === "none") {
                    var nodeName = el.nodeName, body = document.body, display;
                    if (this.displayCache[nodeName])
                        display = this.displayCache[nodeName];
                    else {
                        var testElem = document.createElement(nodeName);
                        body.appendChild(testElem);
                        display = this.getRealDisplay(testElem);
                        if (display === "none")
                            display = "block";
                        body.removeChild(testElem);
                        this.displayCache[nodeName] = display;
                    }
                    el.setAttribute('displayOld', display);
                    el.style.display = display;
                }
            };
            HideoutPlugin.prototype._hideElements = function (element) {
                if (!element)
                    return;
                for (var i = 0; i < element.length; i++) {
                    this._hideElement(element.item(i));
                }
            };
            HideoutPlugin.prototype._showElements = function (element) {
                if (!element)
                    return;
                for (var i = 0; i < element.length; i++) {
                    this._showElement(element.item(i));
                }
            };
            //#endregion
            HideoutPlugin.prototype.toggleColumnByName = function (columnName) {
                if (this.isColumnVisible(columnName)) {
                    this.hideColumnByName(columnName);
                    return false;
                }
                else {
                    this.showColumnByName(columnName);
                    return true;
                }
            };
            HideoutPlugin.prototype.modifyQuery = function (query, scope) {
                var hidden = '';
                var shown = '';
                for (var i = 0; i < this.ColumnStates.length; i++) {
                    if (!this.ColumnStates[i].Visible) {
                        hidden = hidden + ',' + this.ColumnStates[i].RawName;
                    }
                    else {
                        shown = shown + ',' + this.ColumnStates[i].RawName;
                    }
                }
                query.AdditionalData['HideoutHidden'] = hidden;
                query.AdditionalData['HideoutShown'] = shown;
            };
            HideoutPlugin.prototype.hideColumnInstance = function (c) {
                if (!c)
                    return;
                this._columnStates[c.RawName].Visible = false;
                this._columnStates[c.RawName].DoesNotExists = false;
                this._hideElement(this.MasterTable.Renderer.Locator.getHeaderElement(c.Header));
                this._hideElements(this.MasterTable.Renderer.Locator.getPluginElementsByPositionPart("filter-" + c.RawName));
                if (this._isInitializing)
                    return;
                this._hideElements(this.MasterTable.Renderer.Locator.getColumnCellsElements(c));
                if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1)
                    this.MasterTable.Controller.reload();
                this.MasterTable.Renderer.redrawPlugin(this);
            };
            HideoutPlugin.prototype.showColumnInstance = function (c) {
                if (!c)
                    return;
                this._columnStates[c.RawName].Visible = true;
                var wasNotExist = this._columnStates[c.RawName].DoesNotExists;
                this._columnStates[c.RawName].DoesNotExists = false;
                this._showElement(this.MasterTable.Renderer.Locator.getHeaderElement(c.Header));
                this._showElements(this.MasterTable.Renderer.Locator.getPluginElementsByPositionPart("filter-" + c.RawName));
                if (this._isInitializing)
                    return;
                if (wasNotExist) {
                    if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                        this.MasterTable.Controller.reload();
                    }
                    else {
                        this.MasterTable.Controller.redrawVisibleData();
                        ;
                    }
                }
                else {
                    this._showElements(this.MasterTable.Renderer.Locator.getColumnCellsElements(c));
                    if (this.Configuration.ColumnInitiatingReload.indexOf(c.RawName) > -1) {
                        this.MasterTable.Controller.reload();
                    }
                }
                this.MasterTable.Renderer.redrawPlugin(this);
            };
            HideoutPlugin.prototype.onBeforeDataRendered = function () {
                for (var i = 0; i < this.ColumnStates.length; i++) {
                    var col = this.MasterTable.InstanceManager.Columns[this.ColumnStates[i].RawName];
                    if (!this.ColumnStates[i].Visible) {
                        col.Configuration.IsDataOnly = true;
                    }
                    else {
                        col.Configuration.IsDataOnly = false;
                    }
                }
            };
            HideoutPlugin.prototype.onDataRendered = function () {
                for (var i = 0; i < this.ColumnStates.length; i++) {
                    if (!this.ColumnStates[i].Visible)
                        this.ColumnStates[i].DoesNotExists = true;
                }
                this.MasterTable.Renderer.redrawPlugin(this);
            };
            HideoutPlugin.prototype.onLayourRendered = function () {
                for (var j = 0; j < this.ColumnStates.length; j++) {
                    if (this.Configuration.HiddenColumns[this.ColumnStates[j].RawName]) {
                        this.hideColumnByName(this.ColumnStates[j].RawName);
                    }
                }
                this._isInitializing = false;
            };
            HideoutPlugin.prototype.init = function (masterTable) {
                _super.prototype.init.call(this, masterTable);
                this.MasterTable.Loader.registerQueryPartProvider(this);
                for (var i = 0; i < this.Configuration.HideableColumnsNames.length; i++) {
                    var hideable = this.Configuration.HideableColumnsNames[i];
                    var col = this.MasterTable.InstanceManager.Columns[hideable];
                    var instanceInfo = {
                        DoesNotExists: false,
                        Visible: true,
                        RawName: hideable,
                        Name: col.Configuration.Title
                    };
                    if (col.Configuration.IsDataOnly) {
                        throw new Error("Column " + col.RawName + " is .DataOnly but\nincluded into hideable columns list.\n.DataOnly columns are invalid for Hideout plugin. Please remove it from selectable columns list");
                    }
                    this._columnStates[hideable] = instanceInfo;
                    this.ColumnStates.push(instanceInfo);
                }
                this.MasterTable.Events.AfterDataRendered.subscribe(this.onDataRendered.bind(this), 'hideout');
                this.MasterTable.Events.BeforeDataRendered.subscribe(this.onBeforeDataRendered.bind(this), 'hideout');
                this.MasterTable.Events.AfterLayoutRendered.subscribe(this.onLayourRendered.bind(this), 'hideout');
            };
            HideoutPlugin.prototype.renderContent = function (templatesProvider) {
                return templatesProvider.getCachedTemplate('hideout')(this);
            };
            return HideoutPlugin;
        })(Plugins.PluginBase);
        Plugins.HideoutPlugin = HideoutPlugin;
        PowerTables.ComponentsContainer.registerComponent('Hideout', HideoutPlugin);
    })(Plugins = PowerTables.Plugins || (PowerTables.Plugins = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=HideoutPlugin.js.map