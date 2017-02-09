namespace PowerTables.Plugins.Hierarchy
{
    /// <summary>
    /// Derive your row ViewModel from this interface to make it hierarchyable
    /// </summary>
    public interface IHierarchyItem
    {
        /// <summary>
        /// Gets or sets flag, mentioning current node contains child nodes
        /// </summary>
        int ChildrenCount { get; set; }

        /// <summary>
        /// Gets or sets whether node is expanded currently or not
        /// </summary>
        bool IsExpanded { get; set; }
    }

    public interface IHierarchyDisplayRow : IHierarchyItem
    {
        /// <summary>
        /// Gets whether node is in loading state loading subchildren
        /// </summary>
        bool IsLoading { get; }

        /// <summary>
        /// Reveals locally available children of this node
        /// </summary>
        int LocalChildrenCount { get; }

        /// <summary>
        /// Gets current node deepness for templating. 
        /// If this field is not specified explicitly - then it will be evaluated by hierarchy plugin
        /// </summary>
        int Deepness { get; }
    }
}
