using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace PowerTables
{
    /// <summary>
    /// Caches reflection pieces
    /// </summary>
    public static class ReflectionCache
    {
        /// <summary>
        /// typeof(System.Linq.Queryable)
        /// </summary>
        private static readonly Type QueryableType;
        /// <summary>
        /// typeof(System.Linq.Enumerable)
        /// </summary>
        private static readonly Type EnumerableType;
        /// <summary>
        /// OrderBy method of Queryable
        /// </summary>
        public static MethodInfo OrderByMethod;
        /// <summary>
        /// OrderByDescending method of Queryable
        /// </summary>
        public static MethodInfo OrderByDescendingMethod;
        /// <summary>
        /// ThenBy method of Queryable
        /// </summary>
        public static MethodInfo ThenByMethod;
        /// <summary>
        /// ThenByDescending method of Queryable
        /// </summary>
        public static MethodInfo ThenByDescendingMethod;
        /// <summary>
        /// Where method of Queryable
        /// </summary>
        public static MethodInfo WhereMethod;
        /// <summary>
        /// Contains method of Enumerable
        /// </summary>
        public static MethodInfo ContainsMethod;
        /// <summary>
        /// Select method of Queryable
        /// </summary>
        public static MethodInfo SelectMethod;

        static ReflectionCache()
        {
            QueryableType = typeof(Queryable);
            OrderByMethod = QueryableType.GetMethods().Single(c => c.Name == "OrderBy" && c.GetParameters().Length == 2);
            OrderByDescendingMethod = QueryableType.GetMethods().Single(c => c.Name == "OrderByDescending" && c.GetParameters().Length == 2);
            WhereMethod = QueryableType.GetMethods().Where(c => c.Name == "Where").Single(c => c.GetParameters()[1].ParameterType.GetGenericArguments()[0].GetGenericArguments().Length == 2);
            EnumerableType = typeof(Enumerable);
            ContainsMethod =
                EnumerableType.GetMethods().Single(c => c.Name == "Contains" && c.GetParameters().Length == 2);
            ThenByMethod = QueryableType.GetMethods().Single(c => c.Name == "ThenBy" && c.GetParameters().Length == 2);
            ThenByDescendingMethod = QueryableType.GetMethods().Single(c => c.Name == "ThenByDescending" && c.GetParameters().Length == 2);
            SelectMethod = QueryableType.GetMethods().Where(c => c.Name == "Select" && c.GetParameters().Length == 2).Single(c => c.GetParameters()[1].ParameterType.GetGenericArguments()[0].GetGenericArguments().Length == 2);
        }
        private static readonly Dictionary<string, MethodInfo> _genericMethodsCache = new Dictionary<string, MethodInfo>();
        private static readonly Dictionary<Type, PropertyDescription[]> _propertiesCache = new Dictionary<Type, PropertyDescription[]>();
        private static readonly Dictionary<Type, Dictionary<string, PropertyDescription>> _propertyDictionariesCache = new Dictionary<Type, Dictionary<string, PropertyDescription>>();

        private static List<PropertyDescription> ExtractProperties(Type t)
        {
            return (t.GetProperties(BindingFlags.Instance | BindingFlags.Public | BindingFlags.GetProperty |
                                            BindingFlags.SetProperty | BindingFlags.FlattenHierarchy).OrderByDescending(c=>c.DeclaringType!=t).Select(c=>c.Description()).ToList());
        }


        public static void GetCachedProperties<T>(out List<PropertyDescription> properties,
            out Dictionary<string, PropertyDescription> propDictionary)
        {
            var t = typeof (T);
            if (!_propertiesCache.ContainsKey(t))
            {
                lock (_propertiesCache)
                {
                    if (!_propertiesCache.ContainsKey(t))
                    {
                        properties = ExtractProperties(t);
                        _propertiesCache[t] = properties.ToArray();
                    }
                    else
                    {
                        properties = _propertiesCache[t].ToList();
                    }
                }                
            }
            else
            {
                properties = _propertiesCache[t].ToList();
            }
            propDictionary = properties.ToDictionary(c => c.Name, c => c);
        }

        /// <summary>
        /// Gets parametrized method call from cache. If method call with specified generic parameters is not present in cache then creates it.
        /// </summary>
        /// <param name="method">Method</param>
        /// <param name="typeParameters">Method generic arguments</param>
        /// <returns>Parametrized method info</returns>
        private static MethodInfo GetCachedMethod(MethodInfo method, params Type[] typeParameters)
        {
            if (typeParameters.Any(c => c.IsGenericType)) //do not cache methods for generic type defs
            {
                return method.MakeGenericMethod(typeParameters);
            }
            StringBuilder sb = new StringBuilder(method.Name);
            foreach (var typeParameter in typeParameters)
            {
                sb.Append(typeParameter.GUID);
            }
            var genericParamsKey = sb.ToString();
            if (!_genericMethodsCache.ContainsKey(genericParamsKey))
            {
                lock (_genericMethodsCache)
                {
                    if (!_genericMethodsCache.ContainsKey(genericParamsKey))
                    {
                        _genericMethodsCache[genericParamsKey] = method.MakeGenericMethod(typeParameters);
                    }
                }
            }
            return _genericMethodsCache[genericParamsKey];
        }

        /// <summary>
        /// Performs dynamic call of .OrderBy on specified IQueryable
        /// </summary>
        /// <typeparam name="T">IQueryable type parameter</typeparam>
        /// <param name="source">Source queryable</param>
        /// <param name="lambdaExpr">Lambda expression (Func<T,TPropertyType>) to be supplied as first method parameter</param>
        /// <param name="propertyType">Type of OrderBy argument</param>
        /// <returns>Resulting IQueryable</returns>
        public static IQueryable<T> CallOrderBy<T>(IQueryable<T> source, Expression lambdaExpr, Type propertyType)
        {
            var cachedOrderBy = GetCachedMethod(OrderByMethod, typeof(T), propertyType);
            return (IQueryable<T>)cachedOrderBy.Invoke(null, new object[] { source, lambdaExpr });
        }

        /// <summary>
        /// Performs dynamic call of .OrderByDescending on specified IQueryable
        /// </summary>
        /// <typeparam name="T">IQueryable type parameter</typeparam>
        /// <param name="source">Source queryable</param>
        /// <param name="lambdaExpr">Lambda expression (Func<T,TPropertyType>) to be supplied as first method parameter</param>
        /// <param name="propertyType">Type of OrderBy argument</param>
        /// <returns>Resulting IQueryable</returns>
        public static IQueryable<T> CallOrderByDescending<T>(IQueryable<T> source, Expression lambdaExpr, Type propertyType)
        {
            var cachedOrderBy = GetCachedMethod(OrderByDescendingMethod, typeof(T), propertyType);
            return (IQueryable<T>)cachedOrderBy.Invoke(null, new object[] { source, lambdaExpr });
        }

        /// <summary>
        /// Performs dynamic call of .ThenBy on specified IQueryable
        /// </summary>
        /// <typeparam name="T">IQueryable type parameter</typeparam>
        /// <param name="source">Source queryable</param>
        /// <param name="lambdaExpr">Lambda expression (Func<T,TPropertyType>) to be supplied as first method parameter</param>
        /// <param name="propertyType">Type of ThenBy argument</param>
        /// <returns>Resulting IQueryable</returns>
        public static IQueryable<T> CallThenBy<T>(IQueryable<T> source, Expression lambdaExpr, Type propertyType)
        {
            var cachedOrderBy = GetCachedMethod(ThenByMethod, typeof(T), propertyType);
            return (IQueryable<T>)cachedOrderBy.Invoke(null, new object[] { source, lambdaExpr });
        }

        /// <summary>
        /// Performs dynamic call of .ThenByDescending on specified IQueryable
        /// </summary>
        /// <typeparam name="T">IQueryable type parameter</typeparam>
        /// <param name="source">Source queryable</param>
        /// <param name="lambdaExpr">Lambda expression (Func<T,TPropertyType>) to be supplied as first method parameter</param>
        /// <param name="propertyType">Type of ThenBy argument</param>
        /// <returns>Resulting IQueryable</returns>
        public static IQueryable<T> CallThenByDescending<T>(IQueryable<T> source, Expression lambdaExpr, Type propertyType)
        {
            var cachedOrderBy = GetCachedMethod(ThenByDescendingMethod, typeof(T), propertyType);
            return (IQueryable<T>)cachedOrderBy.Invoke(null, new object[] { source, lambdaExpr });
        }

        /// <summary>
        /// Performs dynamic .Where call on specified IQueryable
        /// </summary>
        /// <typeparam name="T">IQueryable type parameter</typeparam>
        /// <param name="source">Source queryable</param>
        /// <param name="lambdaExpr">Lambda expression (Func<T,bool>) to be supplied as first method parameter</param>
        /// <returns>Resulting IQueryable</returns>
        public static IQueryable<T> CallWhere<T>(IQueryable<T> source, Expression lambdaExpr)
        {
            var cachedWhere = GetCachedMethod(WhereMethod, typeof(T));
            return (IQueryable<T>)cachedWhere.Invoke(null, new object[] { source, lambdaExpr });
        }

        /// <summary>
        /// Returns lambda expression that wraps specified filter expression to .Contains call of specified Enumerable (c=>enumerable.Contains(c.Property))
        /// </summary>
        /// <typeparam name="TVal">Type of enumerable value</typeparam>
        /// <param name="enumerable">Enumerable set</param>
        /// <param name="filterExpression">Filter expression</param>
        /// <returns>Lambda expression</returns>
        public static LambdaExpression CallContainsMethod<TVal>(IEnumerable<TVal> enumerable, LambdaExpression filterExpression)
        {
            ConstantExpression cnst = Expression.Constant(enumerable);
            var method = GetCachedMethod(ContainsMethod, typeof (TVal));
            var call = Expression.Call(method, cnst, filterExpression.Body);
            LambdaExpression lambda = Expression.Lambda(call, filterExpression.Parameters);
            return lambda;
        }


        /// <summary>
        /// Returns lambda expression that wraps specified filter expression to .Contains call of specified Enumerable (c=>enumerable.Contains(c.Property))
        /// </summary>
        /// <typeparam name="TVal">Type of enumerable value</typeparam>
        /// <param name="enumerable">Enumerable set</param>
        /// <param name="filterExpression">Filter expression</param>
        /// <returns>Lambda expression</returns>
        public static LambdaExpression CallContainsMethodNongeneric(Type type, object enumerable, LambdaExpression filterExpression)
        {
            ConstantExpression cnst = Expression.Constant(enumerable);
            var method = GetCachedMethod(ContainsMethod, type);
            var call = Expression.Call(method, cnst, filterExpression.Body);
            LambdaExpression lambda = Expression.Lambda(call, filterExpression.Parameters);
            return lambda;
        }

        /// <summary>
        /// Performs dynamic .Select call on specified IQueryable
        /// </summary>
        /// <typeparam name="T">IQueryable type parameter</typeparam>
        /// <param name="source">Source queryable</param>
        /// <param name="lambdaExpr">Lambda expression (Func<T,bool>) to be supplied as first method parameter</param>
        /// <returns>Resulting IQueryable</returns>
        public static IQueryable CallSelect(IQueryable source, Expression lambdaExpr,Type enumerableType,Type targetType)
        {
            var cachedSelect = GetCachedMethod(SelectMethod, enumerableType, targetType);
            return (IQueryable)cachedSelect.Invoke(null, new object[] { source, lambdaExpr });
        }
    }
}
