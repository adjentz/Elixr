using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class WeaponInfoViewModelExtensions
    {
        public static WeaponInfoViewModel ToViewModel(this WeaponInfo wi)
        {
            return new WeaponInfoViewModel
            {
                WeaponInfoId = wi.Id,
                Weapon = wi.Weapon.ToViewModel(),
                Notes = wi.Notes,
                FeaturesApplied = wi.FeaturesApplied.Select(f => f.ToViewModel()).ToList()
            };
        }
    }
}