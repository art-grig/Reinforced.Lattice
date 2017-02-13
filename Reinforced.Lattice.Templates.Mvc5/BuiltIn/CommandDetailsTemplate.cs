namespace Reinforced.Lattice.Templates.BuiltIn
{
    public class CommandDetailsTemplateRegion<TRow, TDetails, TConfirmation> : PluginTemplateRegion, IModelProvider<ICommandDetails<TRow, TDetails, TConfirmation>>,
        IProvidesDatepicker
        
    {
        public CommandDetailsTemplateRegion(IViewPlugins page, string id) : base(page, id)
        {
        }

        public string ExistingModel { get; private set; }
    }

    public interface ICommandDetails<TRow, TDetails,TConfirmation>
    {
        TConfirmation Confirmation { get; }

        TRow Subject { get; }

        TDetails Details { get; }
    }

    public static class CommandDetailsTemplateRegionExtensions
    {
        public static CommandDetailsTemplateRegion<object, object,object> Details(this IViewPlugins p, string templateId)
        {
            return new CommandDetailsTemplateRegion<object, object, object>(p, templateId);
        }

        public static CommandDetailsTemplateRegion<TRow, TDetails, TConfirmation> Details<TRow, TDetails, TConfirmation>(this IViewPlugins p, string templateId)
        {
            return new CommandDetailsTemplateRegion<TRow, TDetails, TConfirmation>(p, templateId);
        }
    }
}
