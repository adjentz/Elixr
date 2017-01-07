using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class Creature : IVotable, IDelistable
    {
        public Creature()
        {
            FeatureInformation = new List<FeatureInfo>();
            FlawInformation = new List<FlawInfo>();
            WeaponInformation = new List<WeaponInfo>();
            ArmorInformation = new List<ArmorInfo>();
            ItemInformation = new List<ItemInfo>();
            SpellInformation = new List<SpellInfo>();
            OathInformation = new List<OathInfo>();
            BaseStats = new List<StatMod>();
            Skills = new List<Skill>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public string Gender { get; set; }
        public string Height { get; set; }
        public string Weight { get; set; }
        public string Hair { get; set; }
        public string Eyes { get; set; }
        public string Skin { get; set; }
        public string Age { get; set; }
        public string Description { get; set; }
        public string PortraitUrl { get; set; }

        public bool IsPlayerCharacter { get; set; }

        public Player Author { get; set; }
        public Race Race { get; set; }
        public List<FeatureInfo> FeatureInformation { get; set; }
        public List<FlawInfo> FlawInformation { get; set; }
        public List<WeaponInfo> WeaponInformation { get; set; }
        public List<ArmorInfo> ArmorInformation { get; set; }
        public List<ItemInfo> ItemInformation { get; set; }
        public List<SpellInfo> SpellInformation { get; set; }
        public List<OathInfo> OathInformation { get; set; }

        public List<Skill> Skills { get; set; }
        public List<StatMod> BaseStats { get; set; }


        public int Level { get; set; }
        public string CurrentEnergyLedger { get; set; }

        public int UpVotes { get; set; }

        public int DownVotes { get; set; }

        public long CreatedAtMS { get; set; }
        public bool Delisted { get; set; }
    }
}
