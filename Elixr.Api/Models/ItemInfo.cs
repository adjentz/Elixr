using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class ItemInfo : IEquipmentInfo
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public virtual Item Item { get; set; }

        public string Notes { get; set; }

        public List<FeatureInfo> FeaturesApplied { get; set; }
    }
}
