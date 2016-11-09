using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Plugins;

namespace PowerTables.Configuration
{
    public static class PrimaryKeyExtensions
    {
        /// <summary>
        /// Points object's key fields. This information is used to assemble 
        /// local key comparison function and compare local objects in runtime. 
        /// It is used to proform update of local objects set
        /// </summary>
        /// <param name="conf">Column configuration</param>
        /// <param name="keyExpression">Expression specifying PK. Must be property expression or anonymous object creation (x=>new{x.A,x.B,x.C})</param>
        public static Configurator<TSourceData, TTableData> PrimaryKey<TSourceData, TTableData,T2>
            (this Configurator<TSourceData, TTableData> conf, Expression<Func<TTableData, T2>> keyExpression) where TTableData : new()
        {
            if (keyExpression.Body.NodeType == ExpressionType.MemberAccess)
            {
                var parse = LambdaHelpers.ParsePropertyLambda(keyExpression);
                return conf.PrimaryKey(parse.Name);
            }
            if (keyExpression.Body.NodeType == ExpressionType.New)
            {
                var expr = (NewExpression) keyExpression.Body;
                List<string> parameterNames = new List<string>();
                if (expr.Arguments.Count==0) throw new Exception("Primary key cannot be empty");
                foreach (var exprArgument in expr.Arguments)
                {
                    var p = LambdaHelpers.ParsePropertyExpression(exprArgument);
                    parameterNames.Add(p.Name);
                }
                return conf.PrimaryKey(parameterNames.ToArray());
            }
            throw new Exception(string.Format("Unknown key expression {0}", keyExpression));
        }

        /// <summary>
        /// Points object's key fields. This information is used to assemble 
        /// local key comparison function and compare local objects in runtime. 
        /// It is used to proform update of local objects set
        /// </summary>
        /// <param name="conf">Column configuration</param>
        /// <param name="keyFields">Columns names representing primary key</param>
        public static T PrimaryKey<T>(this T conf, params string[] keyFields) where T : NongenericConfigurator
        {
            conf.SetPrimaryKey(keyFields);
            return conf;
        }

        private static void ValidatePrimaryKeyDefined(this NongenericConfigurator conf)
        {
            if (conf.HashCalculator == null)
            {
                throw new Exception("You must define primary key on your table rows to use this functionality");
            }
        }

        public static string ProducePrimaryKey<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, TTableData row ) where TTableData : new()
        {
            conf.ValidatePrimaryKeyDefined();
            return conf.HashCalculator.GetKey(row);
        }

        public static IEnumerable<string> ProducePrimaryKeys<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, IEnumerable<TTableData> row) where TTableData : new()
        {
            conf.ValidatePrimaryKeyDefined();
            foreach (var tableData in row)
            {
                yield return conf.HashCalculator.GetKey(tableData);
            }
        }

        public static string ProducePrimaryKey(this NongenericConfigurator conf, object row)
        {
            conf.ValidatePrimaryKeyDefined();
            return conf.HashCalculator.GetKey(row);
        }

        public static IEnumerable<string> ProducePrimaryKeys<T>(this NongenericConfigurator conf, IEnumerable<T> row) where T : new()
        {
            conf.ValidatePrimaryKeyDefined();
            foreach (var tableData in row)
            {
                yield return conf.HashCalculator.GetKey(tableData);
            }
        }


        public static TTableData ParsePrimaryKey<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, string key) where TTableData : new()
        {
            conf.ValidatePrimaryKeyDefined();
            return (TTableData) conf.HashCalculator.DecryptHash(key);
        }

        public static IEnumerable<TTableData> ParsePrimaryKeys<TSourceData, TTableData>(this Configurator<TSourceData, TTableData> conf, IEnumerable<string> keys) where TTableData : new()
        {
            conf.ValidatePrimaryKeyDefined();
            foreach (var tableData in keys)
            {
                yield return (TTableData) conf.HashCalculator.DecryptHash(tableData);
            }
        }


        public static T ParsePrimaryKey<T>(this NongenericConfigurator conf, string key) where T : new()
        {
            conf.ValidatePrimaryKeyDefined();
            return (T)conf.HashCalculator.DecryptHash(key);
        }

        public static IEnumerable<T> ParsePrimaryKeys<T>(this NongenericConfigurator conf, IEnumerable<string> keys) where T : new()
        {
            conf.ValidatePrimaryKeyDefined();
            foreach (var tableData in keys)
            {
                yield return (T)conf.HashCalculator.DecryptHash(tableData);
            }
        }
    }
}
