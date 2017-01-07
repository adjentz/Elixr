using Elixr.Api.Models;
using System.Linq;

namespace Elixr.Api.ViewModels.Extensions
{
    static class ItemExtensions
    {
        public static ItemViewModel ToViewModel(this Item item)
        {
            return new ItemViewModel
            {
                EquipmentId = item.Id,
                Cost = item.Cost,
                Name = item.Name,
                Description = item.Description,
                ImageUrl = item.ImageUrl,
                WeightInPounds = item.WeightInPounds,
                Enchantments = item.Enchantments.Select(e => e.ToViewModel()).ToList(),
                Author = item.Player?.ToViewModel(),
                CreatedAtMS = item.CreatedAtMS
            };
        }
        public static Item ToDomainModel(this ItemViewModel item)
        {
            return new Item
            {
                Id = item.EquipmentId,
                Cost = item.Cost,
                Name = item.Name,
                Description = item.Description,
                ImageUrl = item.ImageUrl,
                WeightInPounds = item.WeightInPounds,
                Enchantments = item.Enchantments.Select(e => e.ToDomainModel()).ToList()
            };
        }
    }
}