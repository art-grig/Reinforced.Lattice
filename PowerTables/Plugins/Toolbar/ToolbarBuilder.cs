using System;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;

namespace PowerTables.Plugins.Toolbar
{
    public class ToolbarBuilder
    {
        internal ToolbarBuilder(List<ToolbarButtonClientConfiguration> existing)
        {
            _buttons = existing;
        }

        internal void AssignIds()
        {
            int counter = 0;
            foreach (var b in Buttons)
            {
                counter = AssignInternalIds(b, counter);
            }
        }

        private int AssignInternalIds(ToolbarButtonClientConfiguration btn, int counter)
        {
            btn.InternalId = counter++;
            foreach (var sbm in btn.Submenu)
            {
                counter = AssignInternalIds(sbm, counter);
            }
            return counter;
        }

        internal ToolbarBuilder()
        {
            _buttons = new List<ToolbarButtonClientConfiguration>();
        }

        private readonly List<ToolbarButtonClientConfiguration> _buttons;

        /// <summary>
        /// Existing toolbar buttons
        /// </summary>
        public IReadOnlyCollection<ToolbarButtonClientConfiguration> Buttons
        {
            get { return _buttons; }
        }

        /// <summary>
        /// Adds simple HTML button to toolbar
        /// </summary>
        /// <param name="htmlContent">Direct HTML content of button</param>
        /// <returns>Fluent</returns>
        public ToolbarItemBuilder AddSimpleButton(string htmlContent)
        {
            var conf = new ToolbarButtonClientConfiguration(){HtmlContent = htmlContent};
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }

        /// <summary>
        /// Adds button invoking specified table command
        /// </summary>
        /// <param name="htmlContent">HTML button content</param>
        /// <param name="command">Command that button initiates</param>
        /// <param name="disableWhileCommand">When true, button will be disabled while command is executing</param>
        /// <returns></returns>
        public ToolbarItemBuilder AddCommandButton(string htmlContent, string command, bool disableWhileCommand = true)
        {
            var conf = new ToolbarButtonClientConfiguration()
            {
                HtmlContent = htmlContent,
                BlackoutWhileCommand = disableWhileCommand,
                Command = command
            };
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }

        /// <summary>
        /// Adds button with nested toolbar (assumed that button is only opening toobar)
        /// </summary>
        /// <param name="htmlContent">Button HTML content</param>
        /// <param name="submenu">Toolbar menu</param>
        /// <returns>Fluent</returns>
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


        /// <summary>
        /// Adds button with nested menu (assumed that button is active and invoking command)
        /// </summary>
        /// <param name="htmlContent">HTML button content</param>
        /// <param name="command">Command that is being executed by pressing button</param>
        /// <param name="submenu">Submenu builder</param>
        /// <param name="disableWhileCommand">When true, button will be disabled while command is executing</param>
        /// <returns></returns>
        public ToolbarItemBuilder AddMenuButton(string htmlContent, string command,
            Action<ToolbarSubmenuBuilder> submenu,
            bool disableWhileCommand = true)
        {
            var conf = new ToolbarButtonClientConfiguration()
            {
                HtmlContent = htmlContent,
                BlackoutWhileCommand = disableWhileCommand,
                Command = command
            };
            var suBuilder = new ToolbarSubmenuBuilder(conf.Submenu);
            submenu(suBuilder);
            _buttons.Add(conf);
            return new ToolbarItemBuilder(conf);
        }
    }
}
