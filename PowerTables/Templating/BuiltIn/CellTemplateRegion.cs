using System.IO;

namespace PowerTables.Templating.BuiltIn
{
    public class CellTemplateRegion<T> : ModeledTemplateRegion<ICellModel<T>>
    {
        public CellTemplateRegion(string prefix, string id, TextWriter writer)
            : base(prefix, id, writer)
        {
        }
    }

    public static class CellTemplateExtensions
    {
        public static CellTemplateRegion<T> Cell<T>(this ITemplatesScope ts, string templateId)
        {
            return new CellTemplateRegion<T>(ts.TemplatesPrefix, templateId,ts.Output);
        }

        public static CellTemplateRegion<object> Cell(this ITemplatesScope ts, string templateId)
        {
            return new CellTemplateRegion<object>(ts.TemplatesPrefix, templateId, ts.Output);
        }
    }
}
