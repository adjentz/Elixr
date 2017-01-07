using System.Collections.Generic;

namespace Elixr.Api.ViewModels
{
    public class EquipmentViewModel
    {
        public EquipmentViewModel()
        {
            Enchantments = new List<EnchantmentViewModel>();
        }
        public int EquipmentId { get; set; }
        public float Cost { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        public float WeightInPounds { get; set; }
        public List<EnchantmentViewModel> Enchantments { get; set; }
        public PlayerViewModel Author { get; set; }
        public long CreatedAtMS { get; set; }
    }
}