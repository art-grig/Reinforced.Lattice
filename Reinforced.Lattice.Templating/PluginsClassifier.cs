namespace Reinforced.Lattice.Templating
{
    internal class PluginsClassifier : IViewPlugins
    {
        private readonly LatticeTemplatesViewModel _model;
        public PluginsClassifier(LatticeTemplatesViewModel model, ITemplatesScope scope)
        {
            _model = model;
            Scope = scope;
        }
        
        public ITemplatesScope Scope { get; }
        public LatticeTemplatesViewModel Model { get { return _model; } }
    }
}