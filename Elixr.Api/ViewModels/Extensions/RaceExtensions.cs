using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class RaceExtensions
    {
        public static RaceViewModel ToViewModel(this Race race)
        {
            return new RaceViewModel
            {
                RaceId = race.Id,
                FlawInformation = race.FlawInformation.Select(f => f.ToViewModel()).ToList(),
                FeatureInformation = race.FeatureInformation.Select(f => f.ToViewModel()).ToList(),
                Name = race.Name,
                Description = race.Description
            };
        }        
        public static Race ToDomainModel(this RaceViewModel race)
        {
            return new Race
            {
                Id = race.RaceId,
                FlawInformation = race.FlawInformation.Select(f => f.ToDomainModel()).ToList(),
                FeatureInformation = race.FeatureInformation.Select(f => f.ToDomainModel()).ToList(),
                Name = race.Name,
                Description = race.Description
            };
        }
    }
}