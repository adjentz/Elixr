using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class CreatureExtensions
    {
        public static CreatureViewModel ToViewModel(this Creature creature)
        {
            return new CreatureViewModel
            {
                CreatureId = creature.Id,
                Name = creature.Name,
                Gender = creature.Gender,
                Height = creature.Height,
                Weight = creature.Weight,
                Hair = creature.Hair,
                Eyes = creature.Eyes,
                Skin = creature.Skin,
                Age = creature.Age,
                Description = creature.Description,
                PortraitUrl = creature.PortraitUrl,
                Race = creature.Race?.ToViewModel(),
                FeatureInformation = creature.FeatureInformation.Select(fi => fi.ToViewModel()).ToList(),
                FlawInformation = creature.FlawInformation.Select(f => f.ToViewModel()).ToList(),
                OathInformation = creature.OathInformation.Select(o => o.ToViewModel()).ToList(),
                WeaponInformation = creature.WeaponInformation.Select(wi => wi.ToViewModel()).ToList(),
                ArmorInformation = creature.ArmorInformation.Select(ai => ai.ToViewModel()).ToList(),
                ItemInformation = creature.ItemInformation.Select(ii => ii.ToViewModel()).ToList(),
                SpellInformation = creature.SpellInformation.Select(si => si.ToViewModel()).ToList(),
                Skills = creature.Skills.Select(s => s.ToViewModel()).ToList(),
                BaseStats = creature.BaseStats.Select(sm => sm.ToViewModel()).ToList(),
                Level = creature.Level,
                CurrentEnergyLedger = creature.CurrentEnergyLedger,
                IsPlayerCharacter = creature.IsPlayerCharacter,
                Author = creature.Author?.ToViewModel(),
                CreatedAtMS = creature.CreatedAtMS
            };
        }
    }
}