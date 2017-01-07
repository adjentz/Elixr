using System.Collections.Generic;
using Elixr.Api.ViewModels;

namespace Elixr.Api.ApiModels
{
    public class SpellFeatureChanges
    {
        public List<FeatureInfoViewModel> NewFeatures { get; set; }
        public int SpellInfoId { get; set; }
        public List<int> DeletedFeatureInfoIds { get; set; }
    }
    public class WeaponFeatureChanges
    {
        public List<FeatureInfoViewModel> NewFeatures { get; set; }
        public int WeaponInfoId { get; set; }
        public List<int> DeletedFeatureInfoIds { get; set; }
    }

    public class CreatureEditInput
    {
        public int CreatureId { get; set; }
        public bool IsPlayerCharacter { get; set; }

        public List<WeaponInfoViewModel> NewWeaponInformation { get; set; }
        public List<int> DeletedWeaponInformationIds { get; set; }
        public List<WeaponFeatureChanges> WeaponFeatureChanges { get; set; }

        public List<ArmorInfoViewModel> NewArmorInformation { get; set; }
        public List<int> DeletedArmorInformationIds { get; set; }

        public List<ItemInfoViewModel> NewItemInformation { get; set; }
        public List<int> DeletedItemInformationIds { get; set; }

        public List<FeatureInfoViewModel> NewFeatureInformation { get; set; }
        public List<int> DeletedFeatureInformationIds { get; set; }

        public List<OathInfoViewModel> NewOathInformation { get; set; }
        public List<int> DeletedOathInformationIds { get; set; }

        public List<FlawInfoViewModel> NewFlawInformation { get; set; }
        public List<int> DeletedFlawInformationIds { get; set; }

        public List<StatModViewModel> NewStatMods { get; set; }
        public List<int> DeletedStatModIds { get; set; }

        public List<SpellInfoViewModel> NewSpellInformation { get; set; }
        public List<int> DeletedSpellInfoIds { get; set; }
        public List<SpellFeatureChanges> SpellFeatureChanges { get; set; }

        public List<SkillViewModel> NewSkills { get; set; }
        public List<int> DeletedSkillIds { get; set; }

        /*These can be null or 0, meaning no change*/
        public int RaceIdChangedTo { get; set; }
        public string NameChangedTo { get; set; }
        public string AgeChangedTo { get; set; }
        public string GenderChangedTo { get; set; }
        public string WeightChangedTo { get; set; }
        public string HeightChangedTo { get; set; }
        public string EyesChangedTo { get; set; }
        public string HairChangedTo { get; set; }
        public string SkinChangedTo { get; set; }
        public string PortraitChangedTo { get; set; }
        public string DescriptionChangedTo { get; set; }

        public int LevelIs { get; set; }
        public string CurrentEnergyLedgerIs { get; set; }
    }
}