﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Reinforced.Lattice.Adjustments;
using Reinforced.Lattice.Configuration;
using Reinforced.Lattice.Configuration.Json;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Plugins.Limit;
using Reinforced.Lattice.Plugins.Paging;
using Reinforced.Lattice.Plugins.RegularSelect;
using Reinforced.Lattice.Plugins.Toolbar;
using Reinforced.Lattice.Processing;

namespace Reinforced.Lattice.DebugSink.Controllers
{
    public class PlanningRow
    {
        public DateTime DateTime { get; set; }

        public Guid Identifier { get; set; }

        public int Day { get; set; }
        public string DayOfWeek { get; set; }

        public string Title { get; set; }

        public string Color { get; set; }
    }

    public class Meeting
    {
        public DateTime Start { get; set; }

        public DateTime End { get; set; }

        public string Description { get; set; }

        public string Color { get; set; }
    }

    public static class MeetingTable
    {
        public static Configurator<DateTime, PlanningRow> Configure(this Configurator<DateTime, PlanningRow> conf)
        {
            conf.PrimaryKey(c => new { c.DateTime });
            conf.ProjectDataWith(c => GetPlanned(c.AsEnumerable()).AsQueryable());
            conf.Paging(c => c.PagingSimple(), where: "rb");
            conf.Limit(c => c.Values(new[] { "12", "24", "All" }), where: "lt");
            conf.Partition(x => x.InitialSkipTake(take: 12));
            conf.RegularSelect(RegularSelectMode.Cells);
            conf.Selection(x => x.ResetSelectionOn(ResetSelectionBehavior.DontReset).SelectAllBehavior(SelectAllBehavior.AllLoadedData));
            conf.Toolbar("toolbar-rt", a =>
            {
                a.AddCommandButton("Something", "Add");
            });
            return conf;
        }

        private static IEnumerable<PlanningRow> GetPlanned(IEnumerable<DateTime> time)
        {
            foreach (var dateTime in time)
            {
                var matchinf = TutorialController._meetings.FirstOrDefault(c => c.Start <= dateTime && c.End > dateTime);
                if (matchinf == null)
                {
                    yield return new PlanningRow()
                    {
                        DateTime = dateTime,
                        Day = dateTime.Day,
                        DayOfWeek = dateTime.DayOfWeek.ToString(),
                        Identifier = Guid.NewGuid()
                    };
                }
                else
                {
                    yield return new PlanningRow()
                    {
                        DateTime = dateTime,
                        Day = dateTime.Day,
                        DayOfWeek = dateTime.DayOfWeek.ToString(),
                        Color = matchinf.Color,
                        Title = matchinf.Description
                    };
                }
            }
        }
    }



    public partial class TutorialController
    {
        internal static List<Meeting> _meetings = new List<Meeting>();

        public ActionResult TimePk()
        {
            var conf = new Configurator<DateTime, PlanningRow>();
            conf.Configure().Url(Url.Action("HandleTimePk"));
            return View(conf);
        }

        private IEnumerable<DateTime> GetDates()
        {
            var curMonth = DateTime.UtcNow.Date.AddDays(-DateTime.UtcNow.Date.Day);
            while (curMonth < DateTime.Today.AddMonths(2))
            {
                yield return curMonth;
                curMonth = curMonth.AddHours(2);
            }
        }

        public ActionResult HandleTimePk()
        {
            var conf = new Configurator<DateTime, PlanningRow>().Configure().CreateMvcHandler(ControllerContext);
            conf.AddCommandHandler("Add", SomethingCmd);
            return conf.Handle(GetDates().AsQueryable());
        }

        public TableAdjustment SomethingCmd(LatticeData<DateTime, PlanningRow> latticeData)
        {
            var selection = latticeData.Selection().ToArray();
            var dt = DateTime.UtcNow.Date.AddDays(-DateTime.UtcNow.Date.Day);
            var dt2 = dt.AddHours(2);
            var dt3 = dt.AddHours(4);
            return latticeData.Configuration.Adjust(c =>
                c.Message(LatticeMessage.User("error", "Blah"))
                .Select(new[] { dt, dt2, dt3 })
                );
        }
    }

}