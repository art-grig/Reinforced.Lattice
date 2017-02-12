using System;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;

namespace Reinforced.Lattice.Plugins.Scrollbar
{
    public static class ScrollbarExtensions
    {
        public const string PluginId = "Scrollbar";

        public static T Scrollbar<T>(this T conf, Action<PluginConfigurationWrapper<ScrollbarPluginUiConfig>> ui = null)
            where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig(PluginId, ui);
            return conf;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> Vertical(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, VerticalStick stick = VerticalStick.Right,
            StickHollow hollow = StickHollow.Internal)
        {
            v.Configuration.IsHorizontal = false;
            v.Configuration.StickDirection = (StickDirection)stick;
            v.Configuration.StickHollow = hollow;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> Horizontal(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, HorizontalStick stick = HorizontalStick.Bottom,
            StickHollow hollow = StickHollow.Internal)
        {
            v.Configuration.IsHorizontal = true;
            v.Configuration.StickDirection = (StickDirection)stick;
            v.Configuration.StickHollow = hollow;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> AppendTo(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, TableElement element)
        {
            v.Configuration.AppendToElement = Element(element);
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> AppendTo(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, string element = "body")
        {
            v.Configuration.AppendToElement = element;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> DragSmoothness(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, int smoothness = 50)
        {
            v.Configuration.ScrollDragSmoothness = smoothness;
            return v;
        }

        private static string Element(TableElement stick)
        {
            switch (stick)
            {
                case TableElement.Body: return "$Body";
                case TableElement.BodyParent: return "$Parent";
                case TableElement.All: return "$All";
            }
            throw new Exception("Unknown table element");
        }

        #region Stick

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> StickTo(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, TableElement stick = TableElement.Body)
        {
            v.Configuration.StickToElementSelector = Element(stick);
            return v;
        }



        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> StickTo(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, string selector)
        {
            v.Configuration.StickToElementSelector = selector;
            return v;
        }

        #endregion

        #region Wheel catcher
        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> CatchWheel(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, TableElement element = TableElement.Body)
        {
            v.Configuration.WheelEventsCatcher = Element(element);
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> CatchWheel(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, string selector)
        {
            v.Configuration.WheelEventsCatcher = selector;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> DontCatchWheel(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v)
        {
            v.Configuration.WheelEventsCatcher = null;
            return v;
        }

        #endregion

        #region Keyboard Catcher

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> CatchKeyboard(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, TableElement element = TableElement.Body)
        {
            v.Configuration.KeyboardEventsCatcher = Element(element);
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> CatchKeyboard(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, string selector)
        {
            v.Configuration.KeyboardEventsCatcher = selector;
            return v;
        }
        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> DontCatchKeyboard(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v)
        {
            v.Configuration.KeyboardEventsCatcher = null;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> KeyMappings(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, Action<ScrollbarKeyMappingsWrapper> mappings)
        {
            ScrollbarKeyMappingsWrapper w = new ScrollbarKeyMappingsWrapper(v.Configuration.Keys);
            mappings(w);
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> KeyboardScrollFocusMode (
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, KeyboardScrollFocusMode mode = Plugins.Scrollbar.KeyboardScrollFocusMode.MouseOver)
        {
            v.Configuration.FocusMode = mode;
            return v;
        }
        #endregion

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> Forces(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, double? pageForce = null, double? wheelForce = null, double? singleForce = null)
        {
            if (pageForce.HasValue) v.Configuration.Forces.PageForce = pageForce.Value;
            if (wheelForce.HasValue) v.Configuration.Forces.WheelForce = wheelForce.Value;
            if (singleForce.HasValue) v.Configuration.Forces.SingleForce = singleForce.Value;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> TakeAsPageForce(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, bool takeAsPageForce = true)
        {
            v.Configuration.UseTakeAsPageForce = takeAsPageForce;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> ScrollerMinSize(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, int minSize = 20)
        {
            v.Configuration.ScrollerMinSize = minSize;
            return v;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> ArrowsDelay(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, int delay = 50)
        {
            v.Configuration.ArrowsDelayMs = 50;
            return v;
        }
    }

    public enum TableElement
    {
        Body,
        All,
        BodyParent
    }
}
