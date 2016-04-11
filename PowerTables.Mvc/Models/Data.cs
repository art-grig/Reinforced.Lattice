using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PowerTables.Mvc.Models
{
    public class Data
    {
        private static List<SourceData> _sourceData;

        public static List<SourceData> SourceData
        {
            get { return _sourceData; }
        }

        static Data()
        {

            #region Data
            _sourceData = new List<SourceData>()
            {
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
                new SourceData(){Cost = 150,GroupType = 0,Id=1,ItemsCount = 50,VeryName = "Alpha"},
                new SourceData(){Cost = 300,GroupType = 1,Id=2,ItemsCount = 1,VeryName = "Beta"},
                new SourceData(){Cost = 450,GroupType = 2,Id=3,ItemsCount = 23,VeryName = "Gamma"},
                new SourceData(){Cost = 20,GroupType = 0,Id=4,ItemsCount = 52,VeryName = "Alpha"},
                new SourceData(){Cost = 750,GroupType = 3,Id=5,ItemsCount = 35,VeryName = "Omega"},
                new SourceData(){Cost = 300,GroupType = 1,Id=6,ItemsCount = 50,VeryName = "Dzeta"},
                new SourceData(){Cost = 70,GroupType = 3,Id=7,ItemsCount = 4,VeryName = "Sygma"},
                new SourceData(){Cost = 223,GroupType = 1,Id=8,ItemsCount = 12,VeryName = "Alpha"},
            };

            _sourceData.AddRange(_sourceData.Select(c => c.Clone()).ToArray());
            _sourceData.AddRange(_sourceData.Select(c => c.Clone()).ToArray());
            _sourceData.AddRange(_sourceData.Select(c => c.Clone()).ToArray());
            _sourceData.AddRange(_sourceData.Select(c => c.Clone()).ToArray());
            _sourceData.AddRange(_sourceData.Select(c => c.Clone()).ToArray());
            _sourceData.AddRange(_sourceData.Select(c => c.Clone()).ToArray());

            Random r = new Random();
            for (int i = 0; i < _sourceData.Count; i++)
            {
                _sourceData[i].Id = i;
                _sourceData[i].IcloudLock = r.Next(0, 10) > 3;
                if (i > 0) _sourceData[i].ItemsCount = r.Next(10, 500);
                _sourceData[i].Cost = r.NextDouble() * 1000;
                _sourceData[i].Delay = 0 - r.Next(0, 30);
            }
            #endregion
        }
    }
}