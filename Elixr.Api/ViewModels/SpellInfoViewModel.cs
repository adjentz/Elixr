using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class SpellInfoViewModel
    {
        public int SpellInfoId { get; set; }
        public SpellViewModel Spell { get; set; }
        public string Notes { get; set; }
        public List<FeatureInfoViewModel> FeaturesApplied { get; set; }
    }
}