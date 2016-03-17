using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Plugins
{
    public class ColumnListBuilder<TSourceData, TTableData> where TTableData : new()
    {
        private Configurator<TSourceData, TTableData> _configurator;
        private readonly List<string> _colNames;
        private readonly IReadOnlyCollection<string> _colNamesRo;

        public IReadOnlyCollection<string> Names
        {
            get { return _colNamesRo; }
        }

        public ColumnListBuilder(Configurator<TSourceData, TTableData> configurator)
        {
            _configurator = configurator;
            _colNames = new List<string>();
            _colNamesRo = _colNames.AsReadOnly();
        }

        public ColumnListBuilder<TSourceData, TTableData> Include<TTableColumn>(
            Expression<Func<TTableData, TTableColumn>> column)
        {
            var info = LambdaHelpers.ParsePropertyLambda(column);
            if (_colNames.Contains(info.Name)) return this;
            _colNames.Add(info.Name);
            return this;
        }

        public ColumnListBuilder<TSourceData, TTableData> IncludeAll()
        {
            _colNames.AddRange(_configurator.TableColumnsDictionary.Select(c => c.Key));
            return this;
        }

        public ColumnListBuilder<TSourceData, TTableData> Except<TTableColumn>(
            Expression<Func<TTableData, TTableColumn>> column)
        {
            var info = LambdaHelpers.ParsePropertyLambda(column);
            if (!_colNames.Contains(info.Name)) return this;
            _colNames.Remove(info.Name);
            return this;
        }
    }
}
