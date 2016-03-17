using System;
using System.Collections.Generic;
using System.Data;
using PowerTables.Configuration.Json;

namespace PowerTables.Typings.Infrastructure
{
    interface IPowerTable
    {
        Dictionary<string, IColumn> Columns { get; }
        Dictionary<string, IFilter> Filters { get; }
        TableConfiguration Configuration { get; }
        TPlugin GetPlugin<TPlugin>(string pluginId, string placement = null);
        void Reload();
        void RequestServer(string command, Action<object> callback, Func<Query, Query> queryModifier = null);
        bool IsDateTime(string columnName);
        string[] GetColumnNames();
        void RegisterQueryPartProvider(IQueryPartProvider provider);
    }
}
