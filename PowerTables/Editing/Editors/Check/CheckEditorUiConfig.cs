namespace PowerTables.Editing.Editors.Check
{
    public class CheckEditorUiConfig : EditFieldUiConfigBase
    {
        public override string PluginId
        {
            get { return "CheckEditor"; }
        }

        public bool IsMandatory { get; set; }
    }
}
