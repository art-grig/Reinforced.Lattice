using System;
using System.Collections.Generic;
using Reinforced.Lattice.Configuration;

namespace Reinforced.Lattice.Adjustments
{
    public static class AdjustmentExtensions
    {
        public static TableAdjustment Adjust<TSource, TData>(this Configurator<TSource, TData> conf, Action<AdjustmentWrapper<TSource, TData>> adjustment) where TData : new()
        {
            var adj = conf.Adjustment();
            adjustment(adj);
            return adj.Build();
        }

        public static TableAdjustment Adjust<TSource, TData>(this LatticeData<TSource, TData> conf, Action<AdjustmentWrapper<TSource, TData>> adjustment) where TData : new()
        {
            return conf.Configuration.Adjust(adjustment);
        }

        public static AdjustmentWrapper<TSource, TData> Adjustment<TSource, TData>(this Configurator<TSource, TData> conf) where TData : new()
        {
            return new AdjustmentWrapper<TSource, TData>(conf);
        }

        public static AdjustmentWrapper<TSource, TData> Adjustment<TSource, TData>(this LatticeData<TSource, TData> conf) where TData : new()
        {
            return new AdjustmentWrapper<TSource, TData>(conf.Configuration);
        }


        public static T Message<T>(this T w, LatticeMessage message) where T : IAdditionalDataProvider
        {
            w.Message = message;
            return w;
        }

        /// <summary>
        /// Specified source entity, corresponding row of which will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Entry of source type to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Update<TSource, TData>(this AdjustmentWrapper<TSource, TData> w,
            TSource src) where TData : new()
        {
            w.AdjustmentsSource.Add(new[] { src });
            return w;
        }

        /// <summary>
        /// Specified source entities set, corresponding rows of which will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Set of entries of source type to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Update<TSource, TData>(this AdjustmentWrapper<TSource, TData> w,
            IEnumerable<TSource> src) where TData : new()
        {
            w.AdjustmentsSource.Add(src);
            return w;
        }


        /// <summary>
        /// Specified table row that will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table row to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Update<TSource, TData>(this AdjustmentWrapper<TSource, TData> w,
            TData src) where TData : new()
        {
            w.AdjustmentsData.Add(new[] { src });
            return w;
        }

        /// <summary>
        /// Specified source entities set, corresponding rows of which will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Set of entries of source type to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<T, T> UpdateRow<T>(this AdjustmentWrapper<T, T> w,
            IEnumerable<T> src) where T : new()
        {
            w.AdjustmentsData.Add(src);
            return w;
        }

        /// <summary>
        /// Specified table row that will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table row to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<T, T> UpdateRow<T>(this AdjustmentWrapper<T, T> w,
            T src) where T : new()
        {
            w.AdjustmentsData.Add(new[] { src });
            return w;
        }

        /// <summary>
        /// Specified table row that will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table row to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<T, T> UpdateSource<T>(this AdjustmentWrapper<T, T> w,
            T src) where T : new()
        {
            w.AdjustmentsSource.Add(new[] { src });
            return w;
        }

        /// <summary>
        /// Specified source entities set, corresponding rows of which will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Set of entries of source type to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<T, T> UpdateSource<T>(this AdjustmentWrapper<T, T> w,
            IEnumerable<T> src) where T : new()
        {
            w.AdjustmentsSource.Add(src);
            return w;
        }

        /// <summary>
        /// Specified table rows set that will be added or updated on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table rows set to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Update<TSource, TData>(this AdjustmentWrapper<TSource, TData> w,
            IEnumerable<TData> src) where TData : new()
        {
            w.AdjustmentsData.Add(src);
            return w;
        }

        /// <summary>
        /// Specified source entity, corresponding row of which will be removed on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Entry of source type to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Remove<TSource, TData>(this AdjustmentWrapper<TSource, TData> w, TSource src) where TData : new()
        {
            w.RemovalsSource.Add(new[] { src });
            return w;
        }

        /// <summary>
        /// Specified source entities set, corresponding rows of which will be removed on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Set of entries of source type to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Remove<TSource, TData>(this AdjustmentWrapper<TSource, TData> w, IEnumerable<TSource> src) where TData : new()
        {
            w.RemovalsSource.Add(src);
            return w;
        }

        /// <summary>
        /// Specified table row that will be removed on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table row to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Remove<TSource, TData>(this AdjustmentWrapper<TSource, TData> w,TData src) where TData : new()
        {
            w.RemovalsData.Add(new[] { src });
            return w;
        }

        /// <summary>
        /// Specified table rows set that will be removed on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table rows set to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<TSource, TData> Remove<TSource, TData>(this AdjustmentWrapper<TSource, TData> w, IEnumerable<TData> src) where TData : new()
        {
            w.RemovalsData.Add(src);
            return w;
        }

        /// <summary>
        /// Specified table rows set that will be removed on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table rows set to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<T, T> RemoveExact<T>(this AdjustmentWrapper<T, T> w, IEnumerable<T> src) where T : new()
        {
            w.RemovalsData.Add(src);
            return w;
        }


        /// <summary>
        /// Specified table row that will be removed on client side
        /// </summary>
        /// <param name="w">Adjustmet wrapper</param>
        /// <param name="src">Table row to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public static AdjustmentWrapper<T, T> RemoveExact<T>(this AdjustmentWrapper<T, T> w, T src) where T : new()
        {
            w.RemovalsData.Add(new[] { src });
            return w;
        }
    }
}
