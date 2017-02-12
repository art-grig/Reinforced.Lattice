using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Plugins.SimpeSelect
{
    public static class SimpleSelectExtensions
    {
        /// <summary>
        /// Adds ability for simple row selection by using mouse click. Nothing special, but fits needs
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conf">Table configuration</param>
        /// <param name="selector">Selector of element that will trigger selection</param>
        /// <returns>Fluent</returns>
        public static T SimpleSelectRow<T>(this T conf, string selector = null) where T : IConfigurator
        {
            conf.SubscribeRowEvent(a =>
                a.Handle("click", "function(c) { c.Master.Selection.toggleDisplayingRow(c.Row); }").Selector(selector));
            return conf;
        }

        /// <summary>
        /// Adds ability for simple cells selection by using mouse click. Nothing special, but fits basic needs
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="conf">Configuration</param>
        /// <param name="selector">Selector of element that will trigger selection</param>
        /// <returns>Fluent</returns>
        public static T SimpleSelectCell<T>(this T conf,string selector = null) where T : IConfigurator
        {
            conf.SubscribeRowEvent(a => a.Handle("click", "function(c) { c.Master.Selection.toggleCellsByDisplayIndex(c.Row,[c.Master.InstanceManager.getColumnNames()[c.Column]]); }").Selector(selector));
            return conf;
        }
    }
}
