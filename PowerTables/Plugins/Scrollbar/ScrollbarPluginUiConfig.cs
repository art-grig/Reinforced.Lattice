using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Plugins.Scrollbar
{
    public class ScrollbarPluginUiConfig : IProvidesTemplate
    {
        public string WheelEventsCatcher { get; set; }

        public string KeyboardEventsCatcher { get; set; }

        public bool IsHorizontal { get; set; }

        public string StickToElementSelector { get; set; }

        public StickDirection StickDirection { get; set; }

        public StickHollow StickHollow { get; set; }

        public string DefaultTemplateId { get { return "scrollbar"; } }

        public ScrollbarPluginUiConfig()
        {
            StickToElementSelector = "$Body";
            WheelEventsCatcher = "$Body";
            KeyboardEventsCatcher = "$Body";
        }
    }

    public enum VerticalStick { Right,Left }

    public enum HorizontalStick { Top = 2, Bottom}

    public enum StickDirection
    {
        Right,
        Left,
        Top,
        Bottom
    }

    public enum StickHollow
    {
        Internal,
        External
    }
}
