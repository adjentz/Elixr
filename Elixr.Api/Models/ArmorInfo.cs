using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class ArmorInfo : IEquipmentInfo
    {
        public int ArmorInfoId { get; set; }
        public int Id { get; set; }
        public int ArmorId { get; set; }
        public virtual Armor Armor { get; set; }
        public List<FeatureInfo> FeaturesApplied { get; set; }

        public string Notes { get; set; }
    }
}
