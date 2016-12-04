module PowerTables.Rendering.Html2Dom {
    export class HtmlParserDefinitions {
        // Regular Expressions for parsing tags and attributes
        public static startTag: RegExp = /^<([-A-Za-z0-9_]+)((?:[\s\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
        public static endTag: RegExp = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
        public static attr: RegExp = /([-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

        // Empty Elements - HTML 4.01
        public static empty: { [index: string]: boolean; } = HtmlParserDefinitions.makeMap('area,base,basefont,br,col,frame,hr,img,input,isindex,link,meta,param,embed');

        // Block Elements - HTML 4.01
        public static block: { [index: string]: boolean; } = HtmlParserDefinitions.makeMap('address,applet,blockquote,button,center,dd,del,dir,div,dl,dt,fieldset,form,frameset,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul,span');

        // Inline Elements - HTML 4.01
        public static inline: { [index: string]: boolean; } = HtmlParserDefinitions.makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,strike,strong,sub,sup,textarea,tt,u,var');

        // Elements that you can, intentionally, leave open
        // (and which close themselves)
        public static closeSelf: { [index: string]: boolean; } = HtmlParserDefinitions.makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

        // Attributes that have their values filled in disabled="disabled"
        public static fillAttrs: { [index: string]: boolean; } = HtmlParserDefinitions.makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

        // Special Elements (can contain anything)
        public static special: { [index: string]: boolean; } = HtmlParserDefinitions.makeMap('script,style');

        private static makeMap(str: any): { [key: string]: boolean } {
            var obj: { [key: string]: boolean } = {}, items: string[] = str.split(',');
            for (var i: number = 0; i < items.length; i++) obj[items[i]] = true;
            return obj;
        }
    }

    /**
     * Small HTML parser to turn user's HTMl to DOM
     * Thanks to John Resig, co-author of jQuery
     * http://ejohn.org/blog/pure-javascript-html-parser/
     */
    export class HtmlParser {
        constructor() {
            this._stack = <any>[];
            this._stack.last = function() {
                if (this.length === 0) return null;
                return this[this.length - 1];
            };
            this._parseStartBound = this.parseStartTag.bind(this);
            this._parseEndBound = this.parseEndTag.bind(this);
        }

        private _parseStartBound;
        private _parseEndBound;
        private _stack: IStack<string>;

        //#region parsering
        private parse(html: string) {
            var index: number,
                chars: boolean,
                match: RegExpMatchArray,
                last: string = html;

            while (html) {
                chars = true;
                var stackCurrent: string = this._stack.last();

                // Make sure we're not in a script or style element
                if (!stackCurrent || !HtmlParserDefinitions.special[stackCurrent]) {
                    // Comment
                    if (html.indexOf('<!--') === 0) {
                        index = html.indexOf('-->');
                        if (index >= 0) {
                            html = html.substring(index + 3);
                            chars = false;
                        }
                        // end tag
                    } else if (html.indexOf('</') === 0) {
                        match = html.match(HtmlParserDefinitions.endTag);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(HtmlParserDefinitions.endTag, this._parseEndBound);
                            chars = false;
                        }

                        // start tag
                    } else if (html.indexOf('<') === 0) {
                        match = html.match(HtmlParserDefinitions.startTag);

                        if (match) {
                            html = html.substring(match[0].length);
                            match[0].replace(HtmlParserDefinitions.startTag, this._parseStartBound);
                            chars = false;
                        }
                    }

                    if (chars) {
                        index = html.indexOf('<');
                        var text: string = index < 0 ? html : html.substring(0, index);
                        html = index < 0 ? '' : html.substring(index);
                        this.chars(text);
                    }

                } else {
                    if (stackCurrent === 'script') {
                        
                    }
                    html = html.replace(new RegExp(`([\\s\\S]*)<\/${this._stack.last()}[^>]*>`,'gm'), (all, text) => {
                        text = text.replace(/<!--(.*?)-->/g, '$1')
                            .replace(/<!\[CDATA\[(.*?)]]>/g, '$1');
                        this.chars(text);
                        return '';
                    });
                    this.parseEndTag('', this._stack.last());
                }

                if (html === last) throw new Error(`HTML Parse Error: ${html}`);
                last = html;
            }

            // Clean up any remaining tags
            this.parseEndTag();
        }

        private parseStartTag(tag: string, tagName: string, rest: any, unary: any): string {
            tagName = tagName.toLowerCase();

            //if (HtmlParserDefinitions.block[tagName]) {
            //    while (this._stack.last() && HtmlParserDefinitions.inline[this._stack.last()]) {
            //        this.parseEndTag("", this._stack.last());
            //    }
            //}

            if (HtmlParserDefinitions.closeSelf[tagName] && this._stack.last() === tagName) {
                this.parseEndTag('', tagName);
            }

            unary = HtmlParserDefinitions.empty[tagName] || !!unary;
            if (!unary) this._stack.push(tagName);
            var attrs: any[] = [];

            rest.replace(HtmlParserDefinitions.attr, function(match: any, name: any) {
                var value = arguments[2] ? arguments[2] :
                    arguments[3] ? arguments[3] :
                    arguments[4] ? arguments[4] :
                    HtmlParserDefinitions.fillAttrs[name] ? name : '';

                attrs.push({
                    name: name,
                    value: value,
                    escaped: value.replace(/(^|[^\\])"/g, '$1\\\"') //"
                });
            });

            this.start(tagName, attrs, unary);
            return '';
        }

        private parseEndTag(tag?: string, tagName?: string): string {
            var pos: number;
            // If no tag name is provided, clean shop
            if (!tagName) pos = 0;
            // Find the closest opened tag of the same type
            else {
                for (pos = this._stack.length - 1; pos >= 0; pos--) if (this._stack[pos] === tagName) break;
            }

            if (pos >= 0) {
                // Close all the open elements, up the stack
                for (var i: number = this._stack.length - 1; i >= pos; i--) this.end(this._stack[i]);

                // Remove the open elements from the stack
                this._stack.length = pos;
            }
            return '';
        }

//#endregion

        //#region DOM creation
        private _curParentNode: HTMLElement;
        private _elems: HTMLElement[] = [];
        private _topNodes: Node[] = [];

        private start(tagName: string, attrs: IAttr[], unary: boolean) {
            var elem: HTMLElement = document.createElement(tagName);
            for (var i: number = 0; i < attrs.length; i++) {
                elem.setAttribute(attrs[i].name, attrs[i].value);
            }
            if (this._curParentNode && this._curParentNode.appendChild) {
                this._curParentNode.appendChild(elem);
            } 
            if (!unary) {
                this._elems.push(elem);
                this._curParentNode = elem;
            }
        }

        private end(tag: any) {
            if (this._elems.length === 1) {
                this._topNodes.push(this._elems[0]);
            }
            this._elems.length -= 1;
            this._curParentNode = this._elems[this._elems.length - 1];
        }

        private chars(text: string) {
            text = text.trim();
            if (text.length === 0) return;
            
            if (text.indexOf('&') > -1) {
                var node = document.createElement('div');
                node.innerHTML = text;
                text = node.textContent;
                node.textContent = '';
            }
            if (this._elems.length === 0) {
                this._topNodes.push(document.createTextNode(text));
            } else {
                this._curParentNode.appendChild(document.createTextNode(text));
            }
        }

//#endregion

        /**
         * Parses supplied HTML string and promotes it to HTML element. 
         * This implementation also supports <script/> tags inside of supplied HTML. Scripts will be executed 
         * immediately after HTML element creation.
         * 
         * @param html HTML string to convert to HTML element
         */
        public html2Dom(html: string): HTMLElement {
            this.parse(html.trim());
            if (this._topNodes.length > 1) {
                throw new Error('Wrapper must have root element. Templates with multiple root elements are not supported yet');
            }
            return <HTMLElement>(this._topNodes.length ? this._topNodes[0] : null);
        }

         /**
         * Parses supplied HTML string and promotes it to set of HTML elements. 
         * This implementation also supports <script/> tags inside of supplied HTML. Scripts will be executed 
         * immediately after all of HTML elements creation.
         * 
         * @param html HTML string to convert to HTML element
         */
        public html2DomElements(html: string): Node[] {
            this.parse(html.trim());
            return this._topNodes;
        }
    }

    /**
     * @internal
     */
    interface IAttr {
        name: string;
        value: string;
        escaped: string;
    }

     /**
     * @internal
     */
    interface IStack<T> extends Array<T> {
        last(): T;
    }
}