namespace PowerTables.Editing.Form
{
    public class FormEditUiConfig : EditFormUiConfigBase
    {

        public string FormTargetSelector { get; set; }

        public string FormTemplateId { get; set; }

        public FormEditUiConfig()
        {
            FormTemplateId = "editForm";
        }
    }
}
