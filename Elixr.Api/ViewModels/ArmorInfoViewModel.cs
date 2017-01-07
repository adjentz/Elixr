using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class ArmorInfoViewModel
    {
        public int ArmorInfoId { get; set; }
        public ArmorViewModel Armor { get; set; }
        public List<FeatureInfoViewModel> FeaturesApplied { get; set; }
        public string Notes { get; set; }
    }
}