using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarBuilder
    {
        public ToolbarBuilder(List<ToolbarButtonClientConfiguration> existing)
        {
            _buttons = existing;
        }

        public ToolbarBuilder()
        {
            _buttons = new List<ToolbarButtonClientConfiguration>();
        }

        private readonly List<ToolbarButtonClientConfiguration> _buttons;

        public IReadOnlyCollection<ToolbarButtonClientConfiguration> Buttons
        {
            get { return _buttons; }
        }

        public ToolbarItemBuilder AddSimpleButton(string htmlContent)
        {
            var conf = new ToolbarButtonClientConfiguration(){HtmlContent = htmlContent};
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }

        public ToolbarItemBuilder AddCommandButton(string htmlContent, string command,
            bool disableWhileCommand = true, string callbackFunction = null,string confirmationFunction = null)
        {
            var conf = new ToolbarButtonClientConfiguration()
            {
                HtmlContent = htmlContent,
                BlackoutWhileCommand = disableWhileCommand,
                Command = command,
                CommandCallbackFunction = callbackFunction != null ? new JRaw(callbackFunction) : null,
                ConfirmationFunction = confirmationFunction!=null? new JRaw(confirmationFunction) : null
            };
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }

        public ToolbarItemBuilder AddMenu(string htmlContent, Action<ToolbarSubmenuBuilder> submenu)
        {
            var conf = new ToolbarButtonClientConfiguration()
            {
                HtmlContent = htmlContent,
                IsMenu = true,
            };
            var suBuilder = new ToolbarSubmenuBuilder(conf.Submenu);
            submenu(suBuilder);
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }

        public ToolbarItemBuilder AddMenuButton(string htmlContent, string command,
            Action<ToolbarSubmenuBuilder> submenu,
            bool disableWhileCommand = true, string callbackFunction = null,
            string confirmationFunction = null)
        {
            var conf = new ToolbarButtonClientConfiguration()
            {
                HtmlContent = htmlContent,
                BlackoutWhileCommand = disableWhileCommand,
                Command = command,
                CommandCallbackFunction = callbackFunction != null ? new JRaw(callbackFunction) : null,
                ConfirmationFunction = confirmationFunction != null ? new JRaw(confirmationFunction) : null
            };
            var suBuilder = new ToolbarSubmenuBuilder(conf.Submenu);
            submenu(suBuilder);
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }
    }
}
