using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class SpellExtensions
    {
        public static SpellViewModel ToViewModel(this Spell spell)
        {
            return new SpellViewModel
            {
                SpellId = spell.Id,
                MovementCost = spell.MovementCost,
                Name = spell.Name,
                RegenTimeInRounds = spell.RegenTimeInRounds,
                EnergyCost = spell.EnergyCost,
                Description = spell.Description,
                Author = spell.Player?.ToViewModel(),
                CreatedAtMS = spell.CreatedAtMS
            };
        }
        public static Spell ToDomainModel(this SpellViewModel spellVM)
        {
            return new Spell
            {
                CreatedAtMS = spellVM.CreatedAtMS,
                Description = spellVM.Description,
                EnergyCost = spellVM.EnergyCost,
                Id = spellVM.SpellId,
                MovementCost = spellVM.MovementCost,
                Name = spellVM.Name,
                RegenTimeInRounds = spellVM.RegenTimeInRounds
            };
        }
    }
}