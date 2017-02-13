using System.Collections.Generic;

namespace Reinforced.Lattice.Plugins.Toolbar
{
    public class ToolbarSubmenuBuilder
    {
        private readonly List<ToolbarButtonClientConfiguration> _buttons;
#if NET45
        public IReadOnlyCollection<ToolbarButtonClientConfiguration> Buttons { get { return _innerBuilder.Buttons; }}
#else
        public IEnumerable<ToolbarButtonClientConfiguration> Buttons { get { return _innerBuilder.Buttons; } }
#endif
        private readonly ToolbarBuilder _innerBuilder;

        public ToolbarSubmenuBuilder(List<ToolbarButtonClientConfiguration> buttons )
        {
            _innerBuilder = new ToolbarBuilder(buttons);
            _buttons = buttons;
        }

        public ToolbarItemBuilder AddSimpleItem(string htmlContent)
        {
            return _innerBuilder.AddSimpleButton(htmlContent);
        }

        public ToolbarItemBuilder AddCommandItem(string htmlContent, string command, bool disableWhileCommand = true)
        {
            return _innerBuilder.AddCommandButton(htmlContent, command, disableWhileCommand);
        }

        public void Separator()
        {
            _buttons.Add(new ToolbarButtonClientConfiguration(){Separator = true});
        }
    }
}
