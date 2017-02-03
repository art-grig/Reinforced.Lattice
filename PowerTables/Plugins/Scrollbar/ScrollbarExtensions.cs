using System;
using PowerTables.Configuration;
using PowerTables.Configuration.Json;

namespace PowerTables.Plugins.Scrollbar
{
    public static class ScrollbarExtensions
    {
        public const string PluginId = "Scrollbar";

        public static T Scrollbar<T>(this T conf, Action<PluginConfigurationWrapper<ScrollbarPluginUiConfig>> ui = null)
            where T : IConfigurator
        {
            conf.TableConfiguration.UpdatePluginConfig(PluginId,ui);
            return conf;
        }

        public static PluginConfigurationWrapper<ScrollbarPluginUiConfig> Vertical(
            this PluginConfigurationWrapper<ScrollbarPluginUiConfig> v, VerticalStick stick = VerticalStick.Right,
            StickHollow hollow = StickHollow.Internal)
        {
            v.Configuration.IsHorizontal = false;
            v.Configuration.StickDirection = (StickDirection) stick;
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
        #endregion
    }

    public enum TableElement
    {
        Body,
        All,
        BodyParent
    }
}
