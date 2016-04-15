using System.IO;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating.BuiltIn
{
    public class RowWrapperTemplateRegion<T> : ModeledTemplateRegion<IRowModel<T>>, 
        IProvidesTracking, 
        IProvidesContent,
        IProvidesColumnContent
    {
        
        public bool IsTrackSet { get; set; }

        public RowWrapperTemplateRegion(string prefix, string id, TextWriter writer) : base(prefix, id, writer)
        {
        }
    }

    /// <summary>
    /// Model interface for table row
    /// </summary>
    /// <typeparam name="TRow">Data object type</typeparam>
    public interface IRowModel<TRow>
    {
        /// <summary>
        /// Data object 
        /// </summary>
        TRow DataObject { get; }

        /// <summary>
        /// Row index
        /// </summary>
        int Index { get; }

        /// <summary>
        /// Row cells
        /// </summary>
        IHbArray<dynamic> Cells { get; }
    }

    public static class RowWrapperExtensions
    {
        public static RowWrapperTemplateRegion<dynamic> RowWrapper(this TemplatesPageBase tp, string templateId = "rowWrapper")
        {
            return new RowWrapperTemplateRegion<dynamic>(tp.Model.Prefix,templateId, tp.Output);
        }

        public static RowWrapperTemplateRegion<TRow> RowWrapper<TRow>(this TemplatesPageBase tp, string templateId = "rowWrapper")
        {
            return new RowWrapperTemplateRegion<TRow>(tp.Model.Prefix,templateId, tp.Output);
        }
    }
}
