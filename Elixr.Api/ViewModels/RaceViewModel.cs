using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class RaceViewModel
    {

        public int RaceId { get; set; }
        public string Description { get; set; }
        public List<FlawInfoViewModel> FlawInformation { get; set; }
        public List<FeatureInfoViewModel> FeatureInformation { get; set; }
        public string Name { get; set; }
    }
}