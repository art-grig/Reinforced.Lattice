using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PowerTables.ResponseProcessing;

namespace PowerTables.Editors
{
    public class TableUpdateResult : JsonNetResult
    {
        public TableUpdateResult(EditionResult result)
        {
            Data = result;
        }

        public TableUpdateResult(IEditionResultContainer result)
        {
            Data = result.EditionResult;
        }

        public static TableUpdateResult FromRange<T>(IEnumerable<T> updated, IEnumerable<T> removed = null)
        {
            EditionResult result = new EditionResult();
            EditionResultWrapper<T> wrapper = new EditionResultWrapper<T>(result);
            foreach (var up in updated)
            {
                wrapper.Adjustments.AddOrUpdate(up);
            }

            if (removed != null)
            {
                foreach (var rem in removed)
                {
                    wrapper.Adjustments.Remove(rem);
                }
            }
            return new TableUpdateResult(result);
        }
    }

    public class EditionResult
    {
        /// <summary>
        /// Table message associated with this response
        /// </summary>
        public TableMessage Message { get; set; }

        [JsonProperty("__XqTFFhTxSu")]
        public bool IsUpdateResult { get { return true; } }

        public object ConfirmedObject { get; set; }

        public AdjustmentData TableAdjustments { get; set; }

        public Dictionary<string, AdjustmentData> OtherTablesAdjustments { get; set; }

        public EditionResult()
        {
            TableAdjustments = new AdjustmentData();
            OtherTablesAdjustments = new Dictionary<string, AdjustmentData>();
        }
    }

    public class AdjustmentData
    {
        public List<object> Removals { get; private set; }

        public List<object> Updates { get; private set; }

        public AdjustmentData()
        {
            Removals = new List<object>();
            Updates = new List<object>();
        }
    }

    public class AdjustmentDataWrapper<T>
    {

        private readonly AdjustmentData _data;

        public AdjustmentDataWrapper(AdjustmentData data)
        {
            _data = data;
        }

        public AdjustmentDataWrapper<T> AddOrUpdate(T obj)
        {
            _data.Updates.Add(obj);
            return this;
        }

        public AdjustmentDataWrapper<T> AddOrUpdate(IEnumerable<T> obj)
        {
            foreach (var v in obj)
            {
                _data.Updates.Add(v);
            }

            return this;
        }

        public AdjustmentDataWrapper<T> Remove(T obj)
        {
            _data.Removals.Add(obj);
            return this;
        }
    }

    public class EditionResultWrapper<T> : IEditionResultContainer
    {
        private readonly EditionResult _result;

        public EditionResultWrapper(EditionResult result)
        {
            _result = result;
            Adjustments = new AdjustmentDataWrapper<T>(_result.TableAdjustments);
        }

        /// <summary>
        /// Changes confirmed object to another. 
        /// confirmed object's fields will be updated on client-side
        /// </summary>
        /// <param name="obj"></param>
        public void Confirm(T obj)
        {
            _result.ConfirmedObject = obj;
        }

        /// <summary>
        /// Object that has been just edited on client side
        /// </summary>
        public T ConfirmedObject { get { return (T)_result.ConfirmedObject; } }

        /// <summary>
        /// Retrieves table's adjustments collections. 
        /// Adjustments colelction hold objects that will be updated in table on client-side.
        /// It is mandatory to have fully defined <typeparamref name="T"/> here
        /// </summary>
        public AdjustmentDataWrapper<T> Adjustments { get; private set; }

        /// <summary>
        /// Adds instructions to adjust another table on client-side
        /// </summary>
        /// <typeparam name="T2"></typeparam>
        /// <param name="tableId">Another table Id. It equals to desired table's root element id without leading hash</param>
        /// <param name="otherTableAdjustments">Operations on other table's adjustments list</param>
        public void AdjustAnotherTable<T2>(string tableId, Action<AdjustmentDataWrapper<T2>> otherTableAdjustments)
        {
            if (!_result.OtherTablesAdjustments.ContainsKey(tableId))
            {
                _result.OtherTablesAdjustments[tableId] = new AdjustmentData();
            }
            AdjustmentDataWrapper<T2> adj = new AdjustmentDataWrapper<T2>(_result.OtherTablesAdjustments[tableId]);
            otherTableAdjustments(adj);
        }

        public EditionResult EditionResult { get { return _result; } }

        public void Message(TableMessage msg)
        {
            EditionResult.Message = msg;
        }
    }

    public interface IEditionResultContainer
    {
        EditionResult EditionResult { get; }
    }
}
