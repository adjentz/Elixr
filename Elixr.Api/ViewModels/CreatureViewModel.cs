using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class CreatureViewModel
    {
        public int CreatureId { get; set; }
        public int Level { get; set; }
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
        public string CurrentEnergyLedger { get; set; }
        public bool IsPlayerCharacter { get; set; }

        public RaceViewModel Race { get; set; }
        public List<FeatureInfoViewModel> FeatureInformation { get; set; }
        public List<FlawInfoViewModel> FlawInformation { get; set; }
        public List<WeaponInfoViewModel> WeaponInformation { get; set; }
        public List<ArmorInfoViewModel> ArmorInformation { get; set; }
        public List<ItemInfoViewModel> ItemInformation { get; set; }
        public List<SpellInfoViewModel> SpellInformation { get; set; }
        public List<SkillViewModel> Skills { get; set; }
        public List<StatModViewModel> BaseStats { get; set; }
        public List<OathInfoViewModel> OathInformation { get; set; }

        public PlayerViewModel Author { get; set; }
        public long CreatedAtMS { get; set; }

    }
}