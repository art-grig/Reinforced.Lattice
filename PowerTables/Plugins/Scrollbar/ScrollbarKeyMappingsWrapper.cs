using System;
using System.Linq;

namespace PowerTables.Plugins.Scrollbar
{
    public class ScrollbarKeyMappingsWrapper
    {
        internal ScrollbarKeyMappings Mappings { get; set; }

        internal ScrollbarKeyMappingsWrapper(ScrollbarKeyMappings mappings)
        {
            Mappings = mappings;
        }

        internal ScrollbarKeyMappingsWrapper()
        {
            Mappings = new ScrollbarKeyMappings();
            Mappings.End = new int[0];
            Mappings.Home = new int[0];
            Mappings.PageDown = new int[0];
            Mappings.PageUp = new int[0];
            Mappings.SingleDown = new int[0];
            Mappings.SingleUp = new int[0];
        }
    }

    public static class KeyMappingExtensions
    {
        private static int[] FromConsoleKeys(ConsoleKey[] keys)
        {
            if (keys == null) return new int[0];
            return keys.Select(x => (int)x).ToArray();
        }

        public static ScrollbarKeyMappingsWrapper End(this ScrollbarKeyMappingsWrapper k, params ConsoleKey[] keys)
        {
            k.Mappings.End = FromConsoleKeys(keys);
            return k;
        }
        public static ScrollbarKeyMappingsWrapper Home(this ScrollbarKeyMappingsWrapper k, params ConsoleKey[] keys)
        {
            k.Mappings.Home = FromConsoleKeys(keys);
            return k;
        }
        public static ScrollbarKeyMappingsWrapper PageDown(this ScrollbarKeyMappingsWrapper k, params ConsoleKey[] keys)
        {
            k.Mappings.PageDown = FromConsoleKeys(keys);
            return k;
        }
        public static ScrollbarKeyMappingsWrapper PageUp(this ScrollbarKeyMappingsWrapper k, params ConsoleKey[] keys)
        {
            k.Mappings.PageUp = FromConsoleKeys(keys);
            return k;
        }
        public static ScrollbarKeyMappingsWrapper SingleDown(this ScrollbarKeyMappingsWrapper k, params ConsoleKey[] keys)
        {
            k.Mappings.SingleDown = FromConsoleKeys(keys);
            return k;
        }
        public static ScrollbarKeyMappingsWrapper SingleUp(this ScrollbarKeyMappingsWrapper k, params ConsoleKey[] keys)
        {
            k.Mappings.SingleUp = FromConsoleKeys(keys);
            return k;
        }
    }
}