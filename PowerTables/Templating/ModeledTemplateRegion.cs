using System.IO;

namespace PowerTables.Templating
{
    public class ModeledTemplateRegion<T> : TemplateRegion, IModelProvider<T>
    {
        public ModeledTemplateRegion(string prefix, string id, ITemplatesScope scope) : base(prefix, id, scope)
        {
        }

        public string ExistingModel { get; private set; }
    }
}
