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
        /// True when this cell is selected, false otherwise.
        /// Warning! Do not mess with Cell.IsSelected. 
        /// When row is selected then it does not mean that cell is selected.
        /// </summary>
        bool IsSelected { get; }


        /// <summary>
        /// True, when row contains updated cells that was updated during adjustment
        /// </summary>
        bool IsUpdated { get; }

        /// <summary>
        /// True when row was added during adjustment
        /// </summary>
        bool IsAdded { get; }

        /// <summary>
        /// True when row was added during adjustment
        /// </summary>
        bool CanBeSelected { get; }

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
        IHbArray<ICellModel<TRow>> Cells { get; }
    }

    public static class RowWrapperExtensions
    {
        public static RowWrapperTemplateRegion<object> RowWrapper(this ITemplatesScope tp, string templateId = "rowWrapper")
        {
            return new RowWrapperTemplateRegion<object>(tp.TemplatesPrefix, templateId, tp.Output);
        }

        public static RowWrapperTemplateRegion<TRow> RowWrapper<TRow>(this ITemplatesScope tp, string templateId = "rowWrapper")
        {
            return new RowWrapperTemplateRegion<TRow>(tp.TemplatesPrefix,templateId, tp.Output);
        }
    }
}
