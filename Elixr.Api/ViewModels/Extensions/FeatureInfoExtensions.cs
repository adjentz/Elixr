using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class FeatureInfoExtensions
    {
        public static FeatureInfoViewModel ToViewModel(this FeatureInfo fi)
        {
            return new FeatureInfoViewModel
            {
                FeatureInfoId = fi.Id,
                Feature = fi.Feature.ToViewModel(),
                CostWhenTaken = fi.CostWhenTaken,
                TakenAtLevel = fi.TakenAtLevel,
                Notes = fi.Notes,
                EnergySacrificedWhenTaken = fi.EnergySacrificedWhenTaken
            };
        }

        public static FeatureInfo ToDomainModel(this FeatureInfoViewModel fi)
        {
            return new FeatureInfo
            {
                Id = fi.FeatureInfoId,
                Feature = fi.Feature.ToDomainModel(),
                FeatureId = fi.Feature.FeatureId,
                CostWhenTaken = fi.CostWhenTaken,
                TakenAtLevel = fi.TakenAtLevel,
                Notes = fi.Notes,
                EnergySacrificedWhenTaken = fi.EnergySacrificedWhenTaken
            };
        }

    }
}