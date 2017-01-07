using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class StatModExtensions
    {
        public static StatModViewModel ToViewModel(this StatMod statMod)
        {
            return new StatModViewModel
            {
                Stat = statMod.Stat,
                Modifier = statMod.Modifier,
                ModifierType = statMod.ModifierType,
                Reason = statMod.Reason,
                StatModId = statMod.Id
            };
        }
        public static StatMod ToDomainModel(this StatModViewModel statMod)
        {
            return new StatMod
            {
                Stat = statMod.Stat,
                Modifier = statMod.Modifier,
                ModifierType = statMod.ModifierType,
                Reason = statMod.Reason
            };
        }
    }
}