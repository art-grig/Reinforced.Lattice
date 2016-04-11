using System.Linq;
using PowerTables.Configuration;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> ProjectionTitlesAndDataOnly(this Configurator<SourceData, TargetData> conf)
        {
            conf.Basic();
            conf.ProjectDataWith(c => c.Select(q => new TargetData()
            {
                Cost = q.Cost,
                CurrentDate = q.CurrentDate,
                EnumValue = (SomeEnum)q.GroupType,
                GroupName = q.VeryName,
                IcloudLock = q.IcloudLock,
                Id = q.Id,
                ItemsCount = q.ItemsCount,
                NullableDate = q.NullableDate,
                NullableValue = q.NullableValue.GetValueOrDefault(0)
            }));

            conf.Column(c => c.IcloudLock).Title("iCloud Lock");
            conf.Column(c => c.ItemsCount).Title("Items count");
            conf.Column(c => c.SomethingDataOnly).DataOnly();
            conf.Column(c => c.BehindProperty).DataOnly();
            

            return conf;
        }
    }
}