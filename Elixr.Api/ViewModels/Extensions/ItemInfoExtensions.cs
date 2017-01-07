using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class ItemInfoExtensions
    {
        public static ItemInfoViewModel ToViewModel(this ItemInfo ii)
        {
            return new ItemInfoViewModel
            {
                ItemInfoId = ii.Id,
                Item = ii.Item.ToViewModel(),
                Notes = ii.Notes,
                FeaturesApplied = ii.FeaturesApplied.Select(fi => fi.ToViewModel()).ToList()
            };
        }
    }
}