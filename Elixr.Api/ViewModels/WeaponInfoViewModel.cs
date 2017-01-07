using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class WeaponInfoViewModel
    {
        public int WeaponInfoId { get; set; }
        public WeaponViewModel Weapon { get; set; }
        public string Notes { get; set; }
        public List<FeatureInfoViewModel> FeaturesApplied { get; set; }
    }
}