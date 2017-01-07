
using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class SpellInfo
    {
        public SpellInfo()
        {
            FeaturesApplied = new List<FeatureInfo>();
        }
        public int Id { get; set; }
        public int SpellId { get; set; }
        public Spell Spell { get; set; }
        public string Notes { get; set; }
        public List<FeatureInfo> FeaturesApplied { get; set; }
    }
}
