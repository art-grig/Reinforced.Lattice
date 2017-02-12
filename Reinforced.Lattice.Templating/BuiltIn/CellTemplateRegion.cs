namespace Reinforced.Lattice.Templates.BuiltIn
{
    public class CellTemplateRegion<T> : ModeledTemplateRegion<ICellModel<T>>
    {
        public CellTemplateRegion(string prefix, string id, ITemplatesScope scope)
            : base(TemplateRegionType.Custom, prefix, id, scope)
        {
        }
    }

    public static class CellTemplateExtensions
    {
        public static CellTemplateRegion<T> Cell<T>(this ITemplatesScope ts, string templateId)
        {
            return new CellTemplateRegion<T>(ts.TemplatesPrefix, templateId,ts);
        }

        public static CellTemplateRegion<object> Cell(this ITemplatesScope ts, string templateId)
        {
            return new CellTemplateRegion<object>(ts.TemplatesPrefix, templateId, ts);
        }
    }
}
