
using System;

namespace Elixr.Api.Models
{
    public class Spell : Models.IVotable, IDelistable
    {
        public const int ConcentrationRegen = 0;
        public const int SeeDescriptionRegen = -1;

        public int Id { get; set; }
        public int MovementCost { get; set; }
        public string Name { get; set; }
        public int RegenTimeInRounds { get; set; }
        public string EnergyCost { get; set; }
        public string Description { get; set; }

        public Player Player { get; set; }

        public int UpVotes { get; set; }

        public int DownVotes { get; set; }
        public long CreatedAtMS { get; set; }

        public bool Delisted { get; set; }
    }
}
