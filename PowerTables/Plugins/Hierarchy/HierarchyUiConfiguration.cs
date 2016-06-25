namespace PowerTables.Plugins.Hierarchy
{
    /// <summary>
    /// Client-side configuration of hierarchy plugin
    /// </summary>
    public class HierarchyUiConfiguration
    {
        public NodeExpandBehavior ExpandBehavior { get; set; }

        public TreeFilteringScope FilteringScope { get; set; }

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
    /// This option controls tree filtering scope
    /// </summary>
    public enum TreeFilteringScope
    {
        /// <summary>
        /// Client filtering will be applied to both roots and leafs
        /// </summary>
        All,

        /// <summary>
        /// Client filtering will be applied only to leafs
        /// </summary>
        LeafsOnly,

        /// <summary>
        /// Client filtering will be applied only to roots
        /// </summary>
        RootsOnly
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
