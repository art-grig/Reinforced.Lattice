using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using Newtonsoft.Json;
using PowerTables.Mvc.Models.Tutorial;

namespace PowerTables.Mvc.Models
{
    public class Data
    {
        private static readonly List<Toy> _sourceData;
        private static readonly string[] _addresses;

        public static List<Toy> SourceData
        {
            get { return _sourceData; }
        }

        private static readonly List<ManagerUser> _users;

        static Data()
        {
            _sourceData = new List<Toy>();

            var usersFile = HttpContext.Current.Server.MapPath("~/Content/users.json");
            var toysFile = HttpContext.Current.Server.MapPath("~/Content/toys.txt");
            var addressesFile = HttpContext.Current.Server.MapPath("~/Content/addresses.txt");
            _addresses = File.ReadAllLines(addressesFile);

            _users = JsonConvert.DeserializeObject<List<ManagerUser>>(File.ReadAllText(usersFile));
            Dictionary<ToyType, List<string>> typestoNames = new Dictionary<ToyType, List<string>>();
            ToyType current = ToyType.ActionFigures;
            List<string> currentList = null;
            using (var fs = File.OpenText(toysFile))
            {
                var line = fs.ReadLine();
                while (line != null)
                {
                    if (line.StartsWith("--"))
                    {
                        if (currentList != null)
                        {
                            typestoNames[current] = currentList;
                        }

                        current = (ToyType)Enum.Parse(typeof(ToyType), line.Substring(2).Trim());
                        currentList = new List<string>();
                    }
                    else
                    {
                        currentList.Add(line);
                    }

                    line = fs.ReadLine();
                }
            }

            typestoNames[current] = currentList;

            Random r = new Random(100);

            int id = 0;
            foreach (var typestoName in typestoNames)
            {
                foreach (var name in typestoName.Value)
                {
                    for (int i = 0; i < 5; i++)
                    {
                        id++;
                        var sd = new Toy()
                        {
                            Id = id,
                            CreatedDate = DateTime.Now.AddDays(0 - r.Next(25)),
                            DeliveryDelay = r.Next(2, 5),
                            GroupType = typestoName.Key,
                            ItemsLeft = r.Next(20),
                            ItemsSold = r.Next(30),
                            LastSoldDate = r.Next(10) > 4 ? (DateTime?)null : DateTime.Now.AddDays(0 - r.Next(25)),
                            Paid = r.Next(10) > 5,
                            PreordersCount = r.Next(10) > 4 ? (int?)null : r.Next(50),
                            Price = r.NextDouble() * 500,
                            ResponsibleUser = _users[r.Next(_users.Count)],
                            StateCode = (byte)r.Next(5),
                            ToyName = i > 0 ? string.Format("{0} ({1})", name, i) : name,
                            SupplierAddress = _addresses[r.Next(_addresses.Length)],
                        };
                        if (r.Next(10) > 5)
                        {
                            sd.PreviousStateCode = (State?) sd.StateCode;
                        }
                        if (r.Next(10) > 5)
                        {
                            sd.ToyName += "searchme";
                        }
                        _sourceData.Add(sd);
                    }
                }
            }
        }
    }
}