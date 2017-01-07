using System.Collections.Generic;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels
{
    public class FeatureViewModel
    {
        public FeatureViewModel()
        {
            Mods = new List<StatModViewModel>();
        }

        public int FeatureId { get; set; }
        public bool CanBeTakenEachLevel { get; set; }
        public FeatureApplyingType ApplyType { get; set; }
        public int Cost { get; set; }
        public bool MustSacrificeEnergy { get; set; }
        public List<StatModViewModel> Mods { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }

        public PlayerViewModel Author { get; set; }
        public long CreatedAtMS { get; set; }
        public int UpVotes { get; set; }
        public int DownVotes { get; set; }
        public List<FlawViewModel> RequiredFlaws { get; set; }
        public List<OathViewModel> RequiredOaths { get; set; }
    }
}