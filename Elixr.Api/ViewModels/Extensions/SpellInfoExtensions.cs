using Elixr.Api.Models;
using System.Linq;

namespace Elixr.Api.ViewModels.Extensions
{
    static class SpellInfoExtensions
    {
        public static SpellInfoViewModel ToViewModel(this SpellInfo si)
        {
            return new SpellInfoViewModel
            {
                Spell = si.Spell.ToViewModel(),
                SpellInfoId = si.Id,
                Notes = si.Notes,
                FeaturesApplied = si.FeaturesApplied.Select(fi => fi.ToViewModel()).ToList()
            };
        }
    }
}