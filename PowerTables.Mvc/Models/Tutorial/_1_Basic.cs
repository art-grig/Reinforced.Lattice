using System;
using PowerTables.Configuration;

namespace PowerTables.Mvc.Models.Tutorial
{
    public static partial class Tutorial
    {
        public static Configurator<SourceData, TargetData> Basic(this Configurator<SourceData, TargetData> conf)
        {
            conf
                .DatePicker(new DatepickerOptions("createDatePicker", "putDateToDatepicker", "getDateFromDatepicker"))
                .AppendEmptyFilters();
            return conf;
        }
    }

    public class SomeBehind
    {
        public int BehindProperty { get; set; }
    }

    public class TargetData : SomeBehind
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public int ItemsCount { get; set; }
        public double Cost { get; set; }
        public SomeEnum EnumValue { get; set; }
        public bool IcloudLock { get; set; }
        public int NullableValue { get; set; }
        public DateTime CurrentDate { get; set; }
        public DateTime? NullableDate { get; set; }
        public int SomethingDataOnly { get; set; }
        public int SomeCustomTemplate { get; set; }

    }

    public enum SomeEnum
    {
        One,
        Two,
        Three,
        Four
    }

    public class SourceData
    {
        public int Id { get; set; }
        public byte GroupType { get; set; }
        public string VeryName { get; set; }
        public int ItemsCount { get; set; }
        public double Cost { get; set; }
        public bool IcloudLock { get; set; }
        public int? NullableValue { get; set; }
        public DateTime CurrentDate { get; set; }
        public DateTime? NullableDate { get; set; }
        public int Delay { get; set; }
        public SourceData Clone()
        {
            return new SourceData()
            {
                Id = Id,
                Cost = Cost,
                CurrentDate = CurrentDate,
                Delay = Delay,
                GroupType = GroupType,
                ItemsCount = ItemsCount,
                IcloudLock = IcloudLock,
                NullableDate = NullableDate,
                NullableValue = NullableValue,
                VeryName = VeryName
            };
        }
    }
}