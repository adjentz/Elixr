namespace Elixr.Api.ViewModels
{
    public class FeatureInfoViewModel
    {
        public int FeatureInfoId { get; set; }
        public FeatureViewModel Feature { get; set; }
        public int CostWhenTaken { get; set; }
        public int EnergySacrificedWhenTaken { get; set; }
        public int TakenAtLevel { get; set; }
        public string Notes { get; set; }
    }
}