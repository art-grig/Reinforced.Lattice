using Reinforced.Typings.Attributes;

namespace PowerTables.Typings.Infrastructure
{
    interface IRenderableComponent
    {
        string Render(object context = null);
        void SubscribeEvents([TsParameter(Type = "JQuery")]object parentElement);
        void SetTemplateId(string templateId = null);

        [TsProperty(Type = "JQuery")]
        object Element { get; set; }
        [TsFunction(Type = "JQuery")]
        object RenderTo([TsParameter(Type = "JQuery")] object parentElement, object context = null);
    }
}
