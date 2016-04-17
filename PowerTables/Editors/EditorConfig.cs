using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PowerTables.Editors
{
    public class EditorConfig
    {
        public EditorUiConfig Config { get; private set; }

        public EditorConfig(EditorUiConfig config)
        {
            Config = config;
        }

        public EditorConfig()
        {
            Config = new EditorUiConfig();
        }
    }
}
