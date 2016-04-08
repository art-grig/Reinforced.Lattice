using System;
using System.IO;
using PowerTables.Configuration.Json;

namespace PowerTables.Templating.BuiltIn
{
    public class PluignWrapperTemplateRegion<T> :
        ModeledTemplateRegion<IPluginWrapperModel<T>>,
        IProvidesEventsBinding,
        IProvidesContent,
        IProvidesTracking
    {
        public PluignWrapperTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "pluginWrapper", writer)
        {
        }



        public bool IsTrackSet { get; set; }

        public override void Dispose()
        {
            if (!IsTrackSet) throw new Exception("Tracking element required for plugin wrapper");
            base.Dispose();
        }
    }

    public class ParametrizedPluginConfiguration<T> : PluginConfiguration
    {
        public ParametrizedPluginConfiguration(string pluginId) : base(pluginId)
        {
        }

        [OverrideHbFieldName("Configuration")]
        public new T Configuration { get; set; }
    }

    public interface IPluginWrapperModel<T>
    {
        ParametrizedPluginConfiguration<T> Configuration { get; set; }

        string PluginLocation { get; set; }
    }

    public static class PluginWrapperExtensions
    {
        public static PluignWrapperTemplateRegion<dynamic> PluginWrapper(this TemplatesPageBase t)
        {
            return new PluignWrapperTemplateRegion<dynamic>(t.Model.Prefix, t.Output);
        }

        public static PluignWrapperTemplateRegion<T> PluginWrapper<T>(this TemplatesPageBase t)
        {
            return new PluignWrapperTemplateRegion<T>(t.Model.Prefix, t.Output);
        }
    }
}