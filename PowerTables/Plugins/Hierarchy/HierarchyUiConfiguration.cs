namespace PowerTables.Plugins.Hierarchy
{
    /// <summary>
    /// Client-side configuration of hierarchy plugin
    /// </summary>
    public class HierarchyUiConfiguration
    {
        public string[] ParentKeyFields { get; set; }

        /// <summary>
        /// Gets or sets expansion behavior. Options are - to load collapsed nodes contents from server-side everywhere or try to fetch from local cache
        /// </summary>
        public NodeExpandBehavior ExpandBehavior { get; set; }

        /// <summary>
        /// Gets or sets tree filtering behavior. Setting this option to ExcludeCollapsed will disallow searching inside collapsed nodes
        /// </summary>
        public TreeCollapsedNodeFilterBehavior CollapsedNodeFilterBehavior { get; set; }
    }

    /// <summary>
    /// Controls policy of nodes collapsing and expanding
    /// </summary>
    public enum NodeExpandBehavior
    {
        /// <summary>
        /// This option will not fetch subtree nodes when locally loaded data available
        /// </summary>
        LoadFromCacheWhenPossible,

        /// <summary>
        /// This option will make hierarchy plugin always fetch subtree from 
        /// server-side even if local data available
        /// </summary>
        AlwaysLoadRemotely
        
    }

    /// <summary>
    /// This option controls client filtering policy related to collapsed nodes 
    /// </summary>
    public enum TreeCollapsedNodeFilterBehavior
    {
        /// <summary>
        /// In this case, even collapsed nodes will be included to filter results
        /// </summary>
        IncludeCollapsed,

        /// <summary>
        /// In this case, even collapsed nodes will be excluded from filter results
        /// </summary>
        ExcludeCollapsed
    }
}
