using System.IO;

namespace PowerTables.Templating
{
    public interface ITemplateRegion
    {
        TextWriter Writer { get; }
    }
    public interface IProvidesContent : ITemplateRegion { }

    public interface IProvidesEventsBinding : ITemplateRegion { }

    public interface IProvidesTracking : ITemplateRegion
    {
        bool IsTrackSet { get; set; }
    }

    public interface IProvidesColumnContent : ITemplateRegion { }

    public interface IModelProvider<T> : ITemplateRegion { }
}
