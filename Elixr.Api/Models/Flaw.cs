using System;
using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class Flaw : IMod, IVotable, IDelistable
    {
        public Flaw()
        {
            Mods = new List<StatMod>();
        }
        public int Id { get; set; }
        public List<StatMod> Mods { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public int UpVotes { get; set; }

        public int DownVotes { get; set; }

        public long CreatedAtMS { get; set; }
        public Player Player { get; set; }

        public bool Delisted { get; set; }
    }
}
