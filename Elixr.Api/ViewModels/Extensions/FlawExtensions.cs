using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class FlawExtensions
    {
        public static FlawViewModel ToViewModel(this Flaw flaw)
        {
            return new FlawViewModel
            {
                FlawId = flaw.Id,
                Mods = flaw.Mods.Select(sm => sm.ToViewModel()).ToList(),
                Name = flaw.Name,
                Description = flaw.Description,
                Author = flaw.Player?.ToViewModel()
            };
        }

        public static Flaw ToDomainModel(this FlawViewModel flaw)
        {
            return new Flaw
            {
                Id = flaw.FlawId,
                Mods = flaw.Mods.Select(sm => sm.ToDomainModel()).ToList(),
                Name = flaw.Name,
                Description = flaw.Description
            };
        }
    }
}