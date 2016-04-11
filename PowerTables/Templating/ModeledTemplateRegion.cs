using System.IO;

namespace PowerTables.Templating
{
    public class ModeledTemplateRegion<T> : TemplateRegion, IModelProvider<T>
    {
        public ModeledTemplateRegion(string prefix, string id, TextWriter writer) : base(prefix, id, writer)
        {
        }

        public string ExistingModel { get; private set; }
    }
}
