using System.Linq;
using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class FeatureExtensions
    {
        public static FeatureViewModel ToViewModel(this Feature feature)
        {
            return new FeatureViewModel
            {
                FeatureId = feature.Id,
                CanBeTakenEachLevel = feature.CanBeTakenEachLevel,
                ApplyType = feature.ApplyType,
                Cost = feature.Cost,
                MustSacrificeEnergy = feature.MustSacrificeEnergy,
                Mods = feature.Mods.Select(sm => sm.ToViewModel()).ToList(),
                Name = feature.Name,
                Description = feature.Description,
                UpVotes = feature.UpVotes,
                DownVotes = feature.DownVotes,
                CreatedAtMS = feature.CreatedAtMS,
                Author = feature.Player?.ToViewModel(),
                RequiredFlaws = feature.RequiredFlaws.Select(f => f.ToViewModel()).ToList(),
                RequiredOaths = feature.RequiredOaths.Select(o => o.ToViewModel()).ToList()
            };
        }

        public static Feature ToDomainModel(this FeatureViewModel feature)
        {
            return new Feature
            {
                Id = feature.FeatureId,
                CanBeTakenEachLevel = feature.CanBeTakenEachLevel,
                ApplyType = feature.ApplyType,
                Cost = feature.Cost,
                MustSacrificeEnergy = feature.MustSacrificeEnergy,
                Mods = feature.Mods.Select(sm => sm.ToDomainModel()).ToList(),
                Name = feature.Name,
                Description = feature.Description,
                RequiredFlaws = feature.RequiredFlaws.Select(f => f.ToDomainModel()).ToList(),
                RequiredOaths = feature.RequiredOaths.Select(o => o.ToDomainModel()).ToList()
            };
        }
    }
}