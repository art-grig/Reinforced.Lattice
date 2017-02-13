namespace Reinforced.Lattice.Templates
{
    internal class PluginsClassifier : IViewPlugins
    {
        private readonly LatticeTemplatesViewModel _model;
        public PluginsClassifier(LatticeTemplatesViewModel model, ITemplatesScope scope)
        {
            _model = model;
            Scope = scope;
        }
        
        public ITemplatesScope Scope { get; private set; }
        public LatticeTemplatesViewModel Model { get { return _model; } }
    }
}