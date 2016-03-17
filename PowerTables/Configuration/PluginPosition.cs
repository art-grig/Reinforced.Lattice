using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Plugin position enum. 
    /// By default table layout contains 4 placeholders for plugins at the each corner. 
    /// This enum represents these corners to make it easier to arrange plugins in table layout. 
    /// Most of plugins extensions contains this method as parameter. Usually it means that 
    /// plugin has some visual implementation and it will be appended to one of 4 placeholders 
    /// specified by this enum value. 
    /// Important: only one instance of each plugin could be placed in each placeholder
    /// </summary>
    public enum PluginPosition
    {
        /// <summary>
        /// Left top corner
        /// </summary>
        LeftTop,

        /// <summary>
        /// Left bottom corner
        /// </summary>
        LeftBottom,

        /// <summary>
        /// Right top corner
        /// </summary>
        RightTop,

        /// <summary>
        /// Right bottom corner
        /// </summary>
        RightBottom
    }

    /// <summary>
    /// Extensions for plugin position
    /// </summary>
    public static class PluginPositionExtensions
    {
        /// <summary>
        /// Converts plugin position enum value to JS-friendly string identifier
        /// </summary>
        /// <param name="pos">Position</param>
        /// <returns>JS-friendly string</returns>
        public static string ToJsFriendly(this PluginPosition pos)
        {
            switch (pos)
            {
                case PluginPosition.LeftBottom: return "lb";
                case PluginPosition.LeftTop: return "lt";
                case PluginPosition.RightBottom: return "rb";
                case PluginPosition.RightTop: return "rt";
            }
            return "lt";
        }

        /// <summary>
        /// Generates full plugin unique ID according to its position
        /// </summary>
        /// <param name="pos">Position</param>
        /// <param name="pluginId">Plugin ID</param>
        /// <returns>JS-friendly plugin ID</returns>
        public static string GeneratePluginId(this PluginPosition pos, string pluginId)
        {
            switch (pos)
            {
                case PluginPosition.LeftBottom: return pluginId + "$lb";
                case PluginPosition.LeftTop: return pluginId + "$lt";
                case PluginPosition.RightBottom: return pluginId + "$rb";
                case PluginPosition.RightTop: return pluginId + "$rt";
            }
            return pluginId + "$lt";
        }
    }
}
