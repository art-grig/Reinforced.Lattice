using Reinforced.Lattice.Templates.Compilation;

namespace Reinforced.Lattice.Templates
{
    public interface IRawProvider : IDeclarator
    {
        SpecialString Raw(string tplCode);

        void WriteRaw(string tplCode);
    }

    /// <summary>
    /// Common interface allowing to start describing Lattice's tempate regions
    /// </summary>
    public interface ITemplateRegion : IRawProvider
    {
        
    }
    
    /// <summary>
    /// Provides .Content method of template regions. 
    /// E.g. row has content - it is cells sequnce. 
    /// Plugin has content. etc
    /// </summary>
    public interface IProvidesContent : ITemplateRegion { }
   
    /// <summary>
    /// Template region prividing this interface also provides binding of events to each 
    /// known template tag. Usually template binging is not used directly but implementing template region should 
    /// provide helper methods for binding DOM events to well-known functionalty
    /// </summary>
    public interface IProvidesEventsBinding : ITemplateRegion { }

    /// <summary>
    /// Provides .Content method consuming column name (column-dependent content)
    /// </summary>
    public interface IProvidesColumnContent : ITemplateRegion { }

    /// <summary>
    /// Implementor should provide View-Model of CLR type that will be serialized to JSON soon. 
    /// Note for implementors:  make your template regions inherit of this interface to provide user with enchanced 
    /// templating capabilities
    /// </summary>
    /// <typeparam name="T">CLR View-Model types</typeparam>
    // ReSharper disable once UnusedTypeParameter
    public interface IModelProvider<T> : ITemplateRegion
    {
        /// <summary>
        /// Existing model identifiers
        /// </summary>
        string ExistingModel { get; }
    }

    /// <summary>
    /// Implementor will provide .Mark extension mehtod to make target plugin's object receive 
    /// specified HTML elements instances
    /// </summary>
    public interface IProvidesMarking : ITemplateRegion { }

    /// <summary>
    /// Implementor should procide .Datepicker method to make JS plugin receive 
    /// HTMLElement containing initialized DatePicker and also set/retrieve data from it. 
    /// This unfctionality is utilizing .Datepicker settings of table configuration
    /// </summary>
    public interface IProvidesDatepicker : ITemplateRegion { }

    /// <summary>
    /// Implementor is providing JS visual states. It means that elements are not redrawn completely, 
    /// but it is possible to perform .State (.When%Something%) call on them
    /// </summary>
    public interface IProvidesVisualState : ITemplateRegion { }
}
