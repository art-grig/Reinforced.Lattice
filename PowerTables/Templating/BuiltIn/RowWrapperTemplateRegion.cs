using System.IO;

namespace PowerTables.Templating.BuiltIn
{
    public class RowWrapperTemplateRegion<T> : ModeledTemplateRegion<IRowModel<T>>, 
        IProvidesTracking, 
        IProvidesContent,
        IProvidesColumnContent
    {
        public RowWrapperTemplateRegion(string prefix, TextWriter writer)
            : base(prefix, "rowWrapper", writer)
        {
        }

        public bool IsTrackSet { get; set; }
    }

    public interface IRowModel<TRow>
    {
        TRow DataObject { get; }

        int Index { get; }
    }

    public static class RowWrapperExtensions
    {
        public static RowWrapperTemplateRegion<dynamic> RowWrapper(this TemplatesPageBase tp)
        {
            return new RowWrapperTemplateRegion<dynamic>(tp.Model.Prefix, tp.Output);
        }

        public static RowWrapperTemplateRegion<TRow> RowWrapper<TRow>(this TemplatesPageBase tp)
        {
            return new RowWrapperTemplateRegion<TRow>(tp.Model.Prefix, tp.Output);
        }
    }
}
