using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class SkillExtensions
    {
        public static SkillViewModel ToViewModel(this Skill skill)
        {
            return new SkillViewModel
            {
                Name = skill.Name,
                Ranks = skill.Ranks,
                BelongsTo = skill.BelongsTo,
                SkillId = skill.Id
            };
        }
    }
}