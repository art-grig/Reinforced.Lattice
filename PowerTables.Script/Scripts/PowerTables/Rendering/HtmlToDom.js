var PowerTables;
(function (PowerTables) {
    var Rendering;
    (function (Rendering) {
        var Html2Dom;
        (function (Html2Dom) {
            var HtmlParserDefinitions = (function () {
                function HtmlParserDefinitions() {
                }
                HtmlParserDefinitions.makeMap = function (str) {
                    var obj = {}, items = str.split(",");
                    for (var i = 0; i < items.length; i++)
                        obj[items[i]] = true;
                    return obj;
                };
                // Regular Expressions for parsing tags and attributes
                HtmlParserDefinitions.startTag = /^<([-A-Za-z0-9_]+)((?:[\s\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
                HtmlParserDefinitions.endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
                HtmlParserDefinitions.attr = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
                // Empty Elements - HTML 4.01
                HtmlParserDefinitions.empty = HtmlParserDefinitions.makeMap("area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed");
                // Block Elements - HTML 4.01
                HtmlParserDefinitions.block = HtmlParserDefinitions.makeMap("address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,span");
                // Inline Elements - HTML 4.01
                HtmlParserDefinitions.inline = HtmlParserDefinitions.makeMap("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,strike,strong,sub,sup,textarea,tt,u,var");
                // Elements that you can, intentionally, leave open
                // (and which close themselves)
                HtmlParserDefinitions.closeSelf = HtmlParserDefinitions.makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");
                // Attributes that have their values filled in disabled="disabled"
                HtmlParserDefinitions.fillAttrs = HtmlParserDefinitions.makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");
                // Special Elements (can contain anything)
                HtmlParserDefinitions.special = HtmlParserDefinitions.makeMap("script,style");
                return HtmlParserDefinitions;
            })();
            Html2Dom.HtmlParserDefinitions = HtmlParserDefinitions;
            /**
             * Small HTML parser to turn user's HTMl to DOM
             * Thanks to John Resig, co-author of jQuery
             * http://ejohn.org/blog/pure-javascript-html-parser/
             */
            var HtmlParser = (function () {
                function HtmlParser() {
                    this._elems = [];
                    this._topNodes = [];
                    this._stack = [];
                    this._stack.last = function () {
                        if (this.length === 0)
                            return null;
                        return this[this.length - 1];
                    };
                }
                //#region parsering
                HtmlParser.prototype.parse = function (html) {
                    var _this = this;
                    var index, chars, match, last = html;
                    while (html) {
                        chars = true;
                        var stackCurrent = this._stack.last();
                        // Make sure we're not in a script or style element
                        if (!stackCurrent || !HtmlParserDefinitions.special[stackCurrent]) {
                            // Comment
                            if (html.indexOf("<!--") === 0) {
                                index = html.indexOf("-->");
                                if (index >= 0) {
                                    html = html.substring(index + 3);
                                    chars = false;
                                }
                            }
                            else if (html.indexOf("</") === 0) {
                                match = html.match(HtmlParserDefinitions.endTag);
                                if (match) {
                                    html = html.substring(match[0].length);
                                    match[0].replace(HtmlParserDefinitions.endTag, this.parseEndTag.bind(this));
                                    chars = false;
                                }
                            }
                            else if (html.indexOf("<") == 0) {
                                match = html.match(HtmlParserDefinitions.startTag);
                                if (match) {
                                    html = html.substring(match[0].length);
                                    match[0].replace(HtmlParserDefinitions.startTag, this.parseStartTag.bind(this));
                                    chars = false;
                                }
                            }
                            if (chars) {
                                index = html.indexOf("<");
                                var text = index < 0 ? html : html.substring(0, index);
                                html = index < 0 ? "" : html.substring(index);
                                this.chars(text);
                            }
                        }
                        else {
                            html = html.replace(new RegExp("(.*)<\/" + this._stack.last() + "[^>]*>"), function (all, text) {
                                text = text.replace(/<!--(.*?)-->/g, "$1")
                                    .replace(/<!\[CDATA\[(.*?)]]>/g, "$1");
                                _this.chars(text);
                                return "";
                            });
                            this.parseEndTag("", this._stack.last());
                        }
                        if (html === last)
                            throw new Error("HTML Parse Error: " + html);
                        last = html;
                    }
                    // Clean up any remaining tags
                    this.parseEndTag();
                };
                HtmlParser.prototype.parseStartTag = function (tag, tagName, rest, unary) {
                    tagName = tagName.toLowerCase();
                    //if (HtmlParserDefinitions.block[tagName]) {
                    //    while (this._stack.last() && HtmlParserDefinitions.inline[this._stack.last()]) {
                    //        this.parseEndTag("", this._stack.last());
                    //    }
                    //}
                    if (HtmlParserDefinitions.closeSelf[tagName] && this._stack.last() === tagName) {
                        this.parseEndTag("", tagName);
                    }
                    unary = HtmlParserDefinitions.empty[tagName] || !!unary;
                    if (!unary)
                        this._stack.push(tagName);
                    var attrs = [];
                    rest.replace(HtmlParserDefinitions.attr, function (match, name) {
                        var value = arguments[2] ? arguments[2] :
                            arguments[3] ? arguments[3] :
                                arguments[4] ? arguments[4] :
                                    HtmlParserDefinitions.fillAttrs[name] ? name : "";
                        attrs.push({
                            name: name,
                            value: value,
                            escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                        });
                    });
                    this.start(tagName, attrs, unary);
                    return '';
                };
                HtmlParser.prototype.parseEndTag = function (tag, tagName) {
                    var pos;
                    // If no tag name is provided, clean shop
                    if (!tagName)
                        pos = 0;
                    else {
                        for (pos = this._stack.length - 1; pos >= 0; pos--)
                            if (this._stack[pos] === tagName)
                                break;
                    }
                    if (pos >= 0) {
                        // Close all the open elements, up the stack
                        for (var i = this._stack.length - 1; i >= pos; i--)
                            this.end(this._stack[i]);
                        // Remove the open elements from the stack
                        this._stack.length = pos;
                    }
                    return '';
                };
                HtmlParser.prototype.start = function (tagName, attrs, unary) {
                    var elem = document.createElement(tagName);
                    for (var i = 0; i < attrs.length; i++) {
                        elem.setAttribute(attrs[i].name, attrs[i].value);
                    }
                    if (this._curParentNode && this._curParentNode.appendChild) {
                        this._curParentNode.appendChild(elem);
                    }
                    if (!unary) {
                        this._elems.push(elem);
                        this._curParentNode = elem;
                    }
                };
                HtmlParser.prototype.end = function (tag) {
                    this._elems.length -= 1;
                    if (this._elems.length === 0) {
                        this._topNodes.push(this._curParentNode);
                    }
                    this._curParentNode = this._elems[this._elems.length - 1];
                };
                HtmlParser.prototype.chars = function (text) {
                    if (text.length === 0)
                        return;
                    if (!this._curParentNode) {
                        throw new Error("Html2Dom error");
                    }
                    this._curParentNode.appendChild(document.createTextNode(text));
                };
                //#endregion
                HtmlParser.prototype.html2Dom = function (html) {
                    this.parse(html.trim());
                    if (this._topNodes.length > 1) {
                        throw new Error("Wrapper must have root element. Templates with multiple root elements are not supported yet");
                    }
                    return this._topNodes.length ? this._topNodes[0] : null;
                };
                return HtmlParser;
            })();
            Html2Dom.HtmlParser = HtmlParser;
        })(Html2Dom = Rendering.Html2Dom || (Rendering.Html2Dom = {}));
    })(Rendering = PowerTables.Rendering || (PowerTables.Rendering = {}));
})(PowerTables || (PowerTables = {}));
//# sourceMappingURL=HtmlToDom.js.map