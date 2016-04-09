using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PowerTables.Mvc.Models
{
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

}