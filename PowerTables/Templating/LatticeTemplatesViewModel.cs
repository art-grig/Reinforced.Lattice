namespace PowerTables.Templating
{
    /// <summary>
    /// ViewModel for All Lattice' templates
    /// </summary>
    public class LatticeTemplatesViewModel
    {
        public string Prefix { get; set; }

        public bool RenderScriptTags { get; set; }

        public LatticeTemplatesViewModel()
        {
            RenderScriptTags = true;
        }
    }
}
