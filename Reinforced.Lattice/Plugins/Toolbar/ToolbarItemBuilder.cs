using Newtonsoft.Json.Linq;

namespace Reinforced.Lattice.Plugins.Toolbar
{
    /// <summary>
    /// Builder for toolbar item (button or submenu)
    /// </summary>
    public class ToolbarItemBuilder
    {
        private readonly ToolbarButtonClientConfiguration _configuration;

        /// <summary>
        /// JSON toolbar button configuration
        /// </summary>
        public ToolbarButtonClientConfiguration Configuration
        {
            get { return _configuration; }
        }

        internal ToolbarItemBuilder(ToolbarButtonClientConfiguration configuration)
        {
            _configuration = configuration;
        }

        /// <summary>
        /// Sets HTML content of toolbar item
        /// </summary>
        /// <param name="content">HTML content to be set</param>
        /// <returns>Fluent</returns>
        public ToolbarItemBuilder HtmlContent(string content)
        {
            _configuration.HtmlContent = content;
            return this;
        }

        /// <summary>
        /// Sets Title of toolbar item
        /// </summary>
        /// <param name="title">Title to be set</param>
        /// <returns>Fluent</returns>
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

        public ToolbarItemBuilder Disabled(bool disabled = true)
        {
            _configuration.IsDisabled = disabled;
            return this;
        }
    }
}
