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
        /// <summary>
        /// True, when @Track() method was used at least once, false otherwise
        /// </summary>
        bool IsTrackSet { get; set; }
    }

    public interface IProvidesColumnContent : ITemplateRegion { }

    public interface IModelProvider<T> : ITemplateRegion { }

    public interface IProvidesMarking : ITemplateRegion { }
    public interface IProvidesDatepicker : ITemplateRegion { }
}
