using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

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

        public ScrollbarKeyMappings Keys { get; set; }
        public ScrollbarForces Forces { get; set; }

        public JRaw PositionCorrector { get; set; }

        public bool UseTakeAsPageForce { get; set; }
        public int ScrollerMinSize { get; set; }
        public int ArrowsDelayMs { get; set; }
        public ScrollbarPluginUiConfig()
        {
            StickToElementSelector = "$Body";
            WheelEventsCatcher = "$Body";
            KeyboardEventsCatcher = "$Body";
            var kw = new ScrollbarKeyMappingsWrapper();
            kw.End(ConsoleKey.End);
            kw.Home(ConsoleKey.Home);
            kw.PageUp(ConsoleKey.PageUp);
            kw.PageDown(ConsoleKey.PageDown,ConsoleKey.Spacebar);
            kw.SingleUp(ConsoleKey.UpArrow);
            kw.SingleDown(ConsoleKey.DownArrow);
            Keys = kw.Mappings;
            Forces = new ScrollbarForces()
            {
                PageForce = 10,
                SingleForce = 1,
                WheelForce = 1
            };
            ScrollerMinSize = 20;
            ArrowsDelayMs = 50;
        }
    }

    public class ScrollbarKeyMappings
    {
        public int[] SingleUp { get; set; }
        public int[] SingleDown { get; set; }

        public int[] PageUp { get; set; }
        public int[] PageDown { get; set; }

        public int[] Home { get; set; }
        public int[] End { get; set; }

    }

    public class ScrollbarForces
    {
        public double WheelForce { get; set; }

        public double SingleForce { get; set; }

        public double PageForce { get; set; }
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
