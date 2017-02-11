using System;
using System.IO;
using PowerTables.Configuration.Json;
using PowerTables.Templating.Expressions;

namespace PowerTables.Templating.BuiltIn
{
    public class PluignWrapperTemplateRegion<T> :
        ModeledTemplateRegion<IPluginWrapperModel<T>>,
        IProvidesEventsBinding,
        IProvidesContent
    {
        public PluignWrapperTemplateRegion(string prefix, string templateId, ITemplatesScope writer)
            : base(TemplateRegionType.Plugin, prefix, templateId, writer)
        {
        }
    }

    public interface IPluginWrapperModel<T>
    {
        PluginConfiguration RawConfig { get; }

        T Configuration { get; }

        string PluginLocation { get; }
    }

    public static class PluginWrapperExtensions
    {
        public static PluignWrapperTemplateRegion<dynamic> PluginWrapper(this ITemplatesScope t, string templateId = "pluginWrapper")
        {
            return new PluignWrapperTemplateRegion<dynamic>(t.TemplatesPrefix, templateId, t);
        }

        public static PluignWrapperTemplateRegion<T> PluginWrapper<T>(this ITemplatesScope t, string templateId = "pluginWrapper")
        {
            return new PluignWrapperTemplateRegion<T>(t.TemplatesPrefix, templateId, t);
        }

        /// <summary>
        /// Template region being used if plugin is having specified location
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="pw"></param>
        /// <param name="locationPart">Part of plugin location</param>
        /// <returns></returns>
        public static CodeBlock IfPlacement<T>(this PluignWrapperTemplateRegion<T> pw, string locationPart)
        {
            return new CodeBlock(string.Format("if(p.isLocation('{0}')){{", locationPart), "}", pw);
        }
    }
}