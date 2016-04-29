using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Templating.Handlebars;

namespace PowerTables.Templating.BuiltIn
{
    public class CellWrapperTemplateRegion<T> :ModeledTemplateRegion<ICellModel<T>>, 
        IProvidesContent,
        IProvidesTracking

    {
        public bool IsTrackSet { get; set; }

        public CellWrapperTemplateRegion(string prefix, string id, TextWriter writer) : base(prefix, id, writer)
        {
        }
    }

    public interface ICellModel
    {
        /// <summary>
        /// Column related to cell
        /// </summary>
        IColumn Column { get; }

        /// <summary>
        /// Data for this particular cell
        /// </summary>
        object Data { get; }

        IHbDictionary<string,string> DataObject { get; }
    }

    /// <summary>
    /// Model interface for cell wrapper
    /// </summary>
    public interface ICellModel<T> : ICellModel
    {
        /// <summary>
        /// Row related to cell
        /// </summary>
        IRowModel<T> Row { get; }
        

        /// <summary>
        /// Data object
        /// </summary>
        [OverrideHbFieldName("DataObject")]
        T TypedDataObject { get; }
        
    }

    public static class CellWrapperExtensions
    {
        public static CellWrapperTemplateRegion<T> CellWrapper<T>(this ITemplatesScope t, string templateId = "cellWrapper")
        {
            return new CellWrapperTemplateRegion<T>(t.TemplatesPrefix,templateId,t.Output);
        }

        public static CellWrapperTemplateRegion<object> CellWrapper(this ITemplatesScope t, string templateId = "cellWrapper")
        {
            return new CellWrapperTemplateRegion<object>(t.TemplatesPrefix, templateId, t.Output);
        }
    }
}
