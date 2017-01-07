using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class FlawInfoExtensions
    {
        public static FlawInfoViewModel ToViewModel(this FlawInfo fi)
        {
            return new FlawInfoViewModel
            {
                FlawInfoId = fi.Id,
                Notes = fi.Notes,
                Flaw = fi.Flaw.ToViewModel()
            };
        }
        public static FlawInfo ToDomainModel(this FlawInfoViewModel fi)
        {
            return new FlawInfo
            {
                Id = fi.FlawInfoId,
                Notes = fi.Notes,
                Flaw = fi.Flaw.ToDomainModel(),
                FlawId = fi.Flaw.FlawId
            };
        }
    }
}