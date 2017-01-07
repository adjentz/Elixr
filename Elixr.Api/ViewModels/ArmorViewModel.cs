namespace Elixr.Api.ViewModels
{
    public class ArmorViewModel : EquipmentViewModel
    {
        public int DefenseBonus { get; set; }
        public int SpeedPenalty { get; set; }
        public int RoundsToDon { get; set; }
        public bool BestowsDisadvantage { get; set; }
    }
}