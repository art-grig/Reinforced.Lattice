using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarItemBuilder
    {
        private readonly ToolbarButtonClientConfiguration _configuration;

        public ToolbarButtonClientConfiguration Configuration
        {
            get { return _configuration; }
        }

        public ToolbarItemBuilder(ToolbarButtonClientConfiguration configuration)
        {
            _configuration = configuration;
        }

        public ToolbarItemBuilder HtmlContent(string content)
        {
            _configuration.HtmlContent = content;
            return this;
        }

        public ToolbarItemBuilder Title(string title)
        {
            _configuration.Title = title;
            return this;
        }

        public ToolbarItemBuilder Css(string css)
        {
            _configuration.Css = css;
            return this;
        }

        public ToolbarItemBuilder Style(string styleString)
        {
            _configuration.Style = styleString;
            return this;
        }

        public ToolbarItemBuilder Id(string id)
        {
            _configuration.Id = id;
            return this;
        }

        public ToolbarItemBuilder DisableIfNothingChecked(bool disable = true)
        {
            _configuration.DisableIfNothingChecked = disable;
            return this;
        }

        public ToolbarItemBuilder OnClick(string function)
        {
            _configuration.OnClick = new JRaw(function);
            return this;
        }
    }
}
