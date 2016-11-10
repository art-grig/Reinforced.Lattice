using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PowerTables.Configuration;

namespace PowerTables.Adjustments
{
    public class AdjustmentWrapper<TSource, TData> : IAdditionalDataProvider where TData : new()
    {
        private readonly Configurator<TSource, TData> _configurator;

        public TableAdjustment Build()
        {
            TableAdjustment result = new TableAdjustment();

            List<TData> updates = new List<TData>();
            foreach (var asr in AdjustmentsSource)
            {
                updates.AddRange(_configurator.MapRange(asr));
            }
            foreach (var asr in AdjustmentsData)
            {
                updates.AddRange(asr);
            }
            result.UpdatedData = _configurator.EncodeResults(updates.AsQueryable());

            List<string> removals = new List<string>();
            foreach (var rs in RemovalsSource)
            {
                removals.AddRange(_configurator.MapRange(rs).Select(c=>_configurator.ProducePrimaryKey(c)));
            }
            foreach (var rs in RemovalsData)
            {
                removals.AddRange(rs.Select(c => _configurator.ProducePrimaryKey(c)));
            }
            result.RemoveKeys = removals.ToArray();
            result.Message = Message;
            result.OtherTableAdjustments = _otherTableAdjustments;
            result.AdditionalData = AdditionalData;
            return result;
        }

        internal List<IEnumerable<TData>> AdjustmentsData = new List<IEnumerable<TData>>();
        internal List<IEnumerable<TSource>> AdjustmentsSource = new List<IEnumerable<TSource>>();
        internal List<IEnumerable<TData>> RemovalsData = new List<IEnumerable<TData>>();
        internal List<IEnumerable<TSource>> RemovalsSource = new List<IEnumerable<TSource>>();

        internal TableMessage Message;

        internal AdjustmentWrapper(Configurator<TSource, TData> configurator)
        {
            _configurator = configurator;
            AdditionalData = new AdditionalDataContainer();
            
        }
        private readonly Dictionary<string,TableAdjustment> _otherTableAdjustments = new Dictionary<string, TableAdjustment>();

        public AdjustmentWrapper<TSource, TData> AdjustAnotherTable<TSourceAnother, TDataAnother>(string tableId,
            Action<Configurator<TSourceAnother, TDataAnother>> configuration,
            Action<AdjustmentWrapper<TSourceAnother, TDataAnother>> adjustments) where TDataAnother : new()
        {
            var newConf = new Configurator<TSourceAnother,TDataAnother>();
            if (configuration != null) configuration(newConf);
            var adj = newConf.Adjustment();
            adjustments(adj);
            var result = adj.Build();
            _otherTableAdjustments[tableId] = result;
            return this;
        }


        public AdjustmentWrapper<TSource, TData> AdjustAnotherTable(string tableId,TableAdjustment result)
        {
            _otherTableAdjustments[tableId] = result;
            return this;
        }

        public AdjustmentWrapper<TSource, TData> AdjustAnotherTable<TSourceAnother, TDataAnother>(string tableId,
            AdjustmentWrapper<TSourceAnother, TDataAnother> adjustments) where TDataAnother : new()
        {
            var result = adjustments.Build();
            _otherTableAdjustments[tableId] = result;
            return this;
        }


        public AdditionalDataContainer AdditionalData { get; private set; }
    }
}
