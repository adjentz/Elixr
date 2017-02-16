using Elixr.Api.Models;
using System.Linq;

namespace Elixr.Api.ViewModels.Extensions
{
    public static class OathExtensions
    {
        public static OathViewModel ToViewModel(this Oath oath)
        {
            return new OathViewModel
            {
                Name = oath.Name,
                Description = oath.Description,
                Mods = oath.Mods.Select(sm => sm.ToViewModel()).ToList(),
                OathId = oath.Id,
                Author = oath.Player?.ToViewModel()
            };
        }
        public static Oath ToDomainModel(this OathViewModel oathVM)
        {
            return new Oath
            {
                Name = oathVM.Name,
                Description = oathVM.Description,
                Mods = oathVM.Mods.Select(o => o.ToDomainModel()).ToList(),
                Id = oathVM.OathId
            };
        }
    }
}