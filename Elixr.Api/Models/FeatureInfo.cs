
namespace Elixr.Api.Models
{
    public class FeatureInfo
    {
        public int Id { get; set; }
        public int FeatureId { get; set; }
        public Feature Feature { get; set; }
        public int CostWhenTaken { get; set; }
        public int EnergySacrificedWhenTaken { get; set; }
        public int TakenAtLevel { get; set; }
        public string Notes { get; set; }
    }
}
