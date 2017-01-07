using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class ArmorInfoExtensions
    {
        public static ArmorInfoViewModel ToViewModel(this ArmorInfo ai)
        {
            return new ArmorInfoViewModel
            {
                ArmorInfoId = ai.Id,
                Armor = ai.Armor.ToViewModel(),
                FeaturesApplied = ai.FeaturesApplied.Select(fi => fi.ToViewModel()).ToList(),
                Notes = ai.Notes
            };
        }
    }
}