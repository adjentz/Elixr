using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public class WeaponInfo : IEquipmentInfo
    {
        public WeaponInfo()
        {
            FeaturesApplied = new List<FeatureInfo>();
        }
        public int Id { get; set; }
        public int WeaponId { get; set; }
        public virtual Weapon Weapon { get; set; }
        public string Notes { get; set; }
        public List<FeatureInfo> FeaturesApplied { get; set; }
    }
}
