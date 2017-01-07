using System;
using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class Feature : IMod, IVotable, IDelistable
    {
        public Feature()
        {
            Mods = new List<StatMod>();
        }
        public int Id { get; set; }
        public bool CanBeTakenEachLevel { get; set; }
        public FeatureApplyingType ApplyType { get; set; }
        public int Cost { get; set; }
        public bool MustSacrificeEnergy { get; set; }
        public List<StatMod> Mods { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public Player Player { get; set; }

        public long CreatedAtMS { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public List<Flaw> RequiredFlaws { get; set; }
        public List<Oath> RequiredOaths { get; set; }

        public bool Delisted { get; set; }
    }
}
