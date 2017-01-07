using Elixr.Api.Models;

namespace Elixr.Api.ViewModels.Extensions
{
    static class PlayerExtensions
    {
        public static PlayerViewModel ToViewModel(this Player player)
        {
            return new PlayerViewModel
            {
                PlayerId = player.Id,
                PlayerName = player.Name
            };
        }
    }
}