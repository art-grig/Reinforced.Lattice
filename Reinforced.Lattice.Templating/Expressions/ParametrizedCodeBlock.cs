using System.IO;

namespace Reinforced.Lattice.Templating.Expressions
{
    public class ParametrizedCodeBlock<T>: CodeBlock, IModelProvider<T>, IProvidesEventsBinding
    {
        public ParametrizedCodeBlock(string header, string footer, IRawProvider raw, string existingModel = null) : base(header, footer, raw)
        {
            ExistingModel = existingModel;
        }

        public TextWriter Writer { get; }
        public virtual string ExistingModel { get; }
    }
}
