using System.IO;

namespace Reinforced.Lattice.Templates.Expressions
{
    public class ParametrizedCodeBlock<T>: CodeBlock, IModelProvider<T>, IProvidesEventsBinding
    {
        public ParametrizedCodeBlock(string header, string footer, IRawProvider raw, string existingModel = null) : base(header, footer, raw)
        {
            ExistingModel = existingModel;
        }

        public TextWriter Writer { get; private set; }
        public virtual string ExistingModel { get; private set; }
    }
}
