
using System;
using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class Equipment : Models.IVotable, IDelistable
    {
        public Equipment()
        {
            Enchantments = new List<Enchantment>();
        }
        public int Id { get; set; }
        public float Cost { get; set; }
        public float WeightInPounds { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public List<Enchantment> Enchantments { get; set; }

        public int UpVotes { get; set; }

        public int DownVotes { get; set; }

        public long CreatedAtMS { get; set; }
        public Player Player { get; set; }

        public bool Delisted { get; set; }
    }
}
