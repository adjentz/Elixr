using System.Collections.Generic;

namespace Elixr.Api.Models
{
    public interface IEquipmentInfo
    {
        string Notes { get; set; }
        List<FeatureInfo> FeaturesApplied { get; set; }
    }
}
