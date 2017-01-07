using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class ItemInfoViewModel
    {
        public int ItemInfoId { get; set; }
        public ItemViewModel Item { get; set; }

        public string Notes { get; set; }

        public List<FeatureInfoViewModel> FeaturesApplied { get; set; }
    }
}