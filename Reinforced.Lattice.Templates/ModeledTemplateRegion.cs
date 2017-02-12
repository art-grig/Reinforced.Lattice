namespace Reinforced.Lattice.Templates
{
    public class ModeledTemplateRegion<T> : TemplateRegion, IModelProvider<T>
    {
        public ModeledTemplateRegion(TemplateRegionType type, string prefix, string id, ITemplatesScope scope) : base(type, prefix, id, scope)
        {
        }

        public string ExistingModel { get; private set; }
    }
}
