namespace PowerTables.Editing.Editors.Memo
{
    public class MemoEditorUiConfig : EditFieldUiConfigBase
    {
        public override string PluginId
        {
            get { return "MemoEditor"; }
        }

        public int WarningChars { get; set; }

        public int MaxChars { get; set; }

        public int Rows { get; set; }

        public int Columns { get; set; }

        public bool AllowEmptyString { get; set; }

        public MemoEditorUiConfig()
        {
            TemplateId = "memoEditor";
        }
    }
}
