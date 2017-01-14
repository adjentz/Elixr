using Elixr.Api.ViewModels.Input;
using Elixr.Api.ApiModels;
using Elixr.Api.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;

namespace Elixr.Api.Controllers
{
    public class AuthenticationController : Controller
    {
        private readonly ElixrDbContext dbContext;
        public AuthenticationController(ElixrDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost("~/authentication/login")]
        public async Task<AuthToken> Login([FromBody]LoginInputModel inputModel)
        {
            var player = await dbContext.Players.FirstOrDefaultAsync(p => p.Name.ToLower() == inputModel.PlayerName.ToLower() && p.SecurityHash == Utilities.HashText(inputModel.Password));
            if (player == null)
            {
                return null;
            }
            return new AuthToken
            {
                PlayerName = player.Name,
                PlayerId = player.Id,
                Signature = CreateSignature(player)
            };
        }

        [HttpPost("~/authentication/signup")]
        public async Task<AuthToken> Signup([FromBody]SignupInputModel inputModel)
        {
            if (await dbContext.Players.AnyAsync(p => p.Name.ToLower() == inputModel.PlayerName.ToLower()))
            {
                return null;
            }

            Player player = new Player()
            {
                Name = inputModel.PlayerName,
                SecurityHash = Utilities.HashText(inputModel.InitialPassword)
            };
            dbContext.Players.Add(player);

            await dbContext.SaveChangesAsync();

            return new AuthToken
            {
                PlayerName = player.Name,
                PlayerId = player.Id,
                Signature = CreateSignature(player)
            };
        }

        private static string CreateSignature(Player player)
        {
            return Utilities.HashText(player.StrToHash);
        }
    }
}