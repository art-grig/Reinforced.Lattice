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
    /// <summary>
    /// ActionResult that will update table data (or several tables) on client side
    /// </summary>
    public class TableUpdateResult : JsonNetResult
    {
        /// <summary>
        /// Edition result object
        /// </summary>
        public EditionResult EditionResult { get; private set; }

        /// <summary>
        /// Constructs new table update result from existing EditionResult
        /// </summary>
        /// <param name="result">Edition result object</param>
        public TableUpdateResult(EditionResult result)
        {
            Data = result;
            EditionResult = result;
        }

        /// <summary>
        /// Constructs new table update result from existing EditionResult
        /// </summary>
        /// <param name="result">Edition result object</param>
        public TableUpdateResult(IEditionResultContainer result)
        {
            Data = result.EditionResult;
            EditionResult = result.EditionResult;
        }

        /// <summary>
        /// Constructs new table update result from updated/removed sets and table message. Type parameter must be target table's row type
        /// </summary>
        /// <typeparam name="T">Target table's row type</typeparam>
        /// <param name="updated">Set of updated entries</param>
        /// <param name="removed">Set of removed entries. Only primary key specified with configuration's .PrimaryKey will be enough here</param>
        /// <param name="message">Table message to show</param>
        /// <returns></returns>
        public static TableUpdateResult FromRange<T>(IEnumerable<T> updated = null, IEnumerable<T> removed = null,TableMessage message = null)
        {
            EditionResult result = new EditionResult();
            EditionResultWrapper<T> wrapper = new EditionResultWrapper<T>(result);
            result.Message = message;
            if (updated != null)
            {
                foreach (var up in updated)
                {
                    wrapper.Adjustments.AddOrUpdate(up);
                }
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

        /// <summary>
        /// Constructs new table update result containing only table message
        /// </summary>
        /// <param name="message">Table message to show</param>
        public static TableUpdateResult FromMessage(TableMessage message)
        {
            EditionResult result = new EditionResult();
            result.Message = message;
            return new TableUpdateResult(result);
        }

        /// <summary>
        /// Constructs new table update result from updated/removed sets and table message. Type parameter must be target table's row type
        /// </summary>
        /// <typeparam name="T">Target table's row type</typeparam>
        /// <param name="editionResultAction">Action representing edition results on table</param>
        /// <returns></returns>
        public static TableUpdateResult FromEditionResult<T>(Action<EditionResultWrapper<T>> editionResultAction)
        {
            EditionResult result = new EditionResult();
            EditionResultWrapper<T> wrapper = new EditionResultWrapper<T>(result);
            editionResultAction(wrapper);
            return new TableUpdateResult(result);
        }

    }

    /// <summary>
    /// Result of table edition or other action
    /// </summary>
    public class EditionResult
    {
        /// <summary>
        /// Table message associated with this response
        /// </summary>
        public TableMessage Message { get; set; }

        /// <summary>
        /// Special mark to disctinguish Edition result from others on client side
        /// </summary>
        [JsonProperty("__XqTFFhTxSu")]
        public bool IsUpdateResult { get { return true; } }

        /// <summary>
        /// Object which edition is confirmed. 
        /// When using in-table editing, edited object will be passed here
        /// </summary>
        public object ConfirmedObject { get; set; }

        /// <summary>
        /// Adjustments set for table that has initiated request
        /// </summary>
        public AdjustmentData TableAdjustments { get; set; }

        /// <summary>
        /// Adjustments for other tables located on same page. 
        /// Here: key is other table id (the same that has passed to table initialization script)
        /// value is adjustmetns set for mentioned table
        /// </summary>
        public Dictionary<string, AdjustmentData> OtherTablesAdjustments { get; set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public EditionResult()
        {
            TableAdjustments = new AdjustmentData();
            OtherTablesAdjustments = new Dictionary<string, AdjustmentData>();
        }
    }

    /// <summary>
    /// Adjustments set for particular table
    /// </summary>
    public class AdjustmentData
    {
        /// <summary>
        /// Objects that should be removed from clien table
        /// </summary>
        public List<object> Removals { get; private set; }

        /// <summary>
        /// Objects that should be updated in client table
        /// </summary>
        public List<object> Updates { get; private set; }

        /// <summary>
        /// Additional data being serialized for client. 
        /// This field could contain anything that will be parsed on client side and corresponding actions will be performed. 
        /// See <see cref="IResponseModifier"/> 
        /// </summary>
        public Dictionary<string, object> AdditionalData { get; private set; }

        /// <summary>
        /// Default constructor
        /// </summary>
        public AdjustmentData()
        {
            Removals = new List<object>();
            Updates = new List<object>();
            AdditionalData = new Dictionary<string, object>();
        }
    }

    /// <summary>
    /// Strongly typed adjustment data wrapper.  Type parameter must be target table's row type
    /// </summary>
    /// <typeparam name="T">Target table's row type</typeparam>
    public class AdjustmentDataWrapper<T>
    {

        private readonly AdjustmentData _data;

        /// <summary>
        /// Constructs new adjustment data wrapper from existing table adjustment data
        /// </summary>
        /// <param name="data"></param>
        public AdjustmentDataWrapper(AdjustmentData data)
        {
            _data = data;
        }

        /// <summary>
        /// Specified entry will be added or updated on client side
        /// </summary>
        /// <param name="entry">Entry to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public AdjustmentDataWrapper<T> AddOrUpdate(T entry)
        {
            _data.Updates.Add(entry);
            return this;
        }

        /// <summary>
        /// Specified entries will be added or updated on client side
        /// </summary>
        /// <param name="entries">Entries to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public AdjustmentDataWrapper<T> AddOrUpdateAll(IEnumerable<T> entries)
        {
            foreach (var v in entries)
            {
                _data.Updates.Add(v);
            }

            return this;
        }

        /// <summary>
        /// Specified entry that should be removed on client side.  Only primary key specified with configuration's .PrimaryKey will be enough here
        /// </summary>
        /// <param name="entry">Entry to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public AdjustmentDataWrapper<T> Remove(T entry)
        {
            _data.Removals.Add(entry);
            return this;
        }

        /// <summary>
        /// Specified entries that should be removed on client side.  Only primary key specified with configuration's .PrimaryKey will be enough here
        /// </summary>
        /// <param name="entries">Entries to be added/updated on client side</param>
        /// <returns>Fluent</returns>
        public AdjustmentDataWrapper<T> RemoveAll(IEnumerable<T> entries)
        {
            foreach (var v in entries)
            {
                Remove(v);
            }
            return this;
        }
    }

    /// <summary>
    /// Strongly-typed wrapper for edition result containing edited table data
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class EditionResultWrapper<T> : IEditionResultContainer
    {
        private readonly EditionResult _result;

        /// <summary>
        /// Constructs new edition result wrapper from existing edition result
        /// </summary>
        /// <param name="result"></param>
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

        /// <summary>
        /// Core untyped EditionResult object
        /// </summary>
        public EditionResult EditionResult { get { return _result; } }

        /// <summary>
        /// Adds messge to be shown after edition
        /// </summary>
        /// <param name="msg">Message</param>
        public void Message(TableMessage msg)
        {
            EditionResult.Message = msg;
        }
    }

    /// <summary>
    /// Interface for any entity containing EditionResult object
    /// </summary>
    public interface IEditionResultContainer
    {
        /// <summary>
        /// Edition result object
        /// </summary>
        EditionResult EditionResult { get; }
    }
}
