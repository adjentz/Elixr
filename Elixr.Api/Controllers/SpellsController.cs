using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Elixr.Api.ViewModels;
using Elixr.Api.ViewModels.Extensions;
using Elixr.Api.Services;
using Elixr.Api.ApiModels;
using Elixr.Api.Models;
using System;
using Microsoft.EntityFrameworkCore;

namespace Elixr.Api.Controllers
{
    public class SpellsController
    {
        ElixrDbContext dbCtx;
        UserSession userSession;

        public SpellsController(ElixrDbContext dbCtx, UserSession userSession)
        {
            this.dbCtx = dbCtx;
            this.userSession = userSession;
        }

        
        [HttpPost("~/spells/create")]
        public async Task<SpellViewModel> CreateSpell([FromBody]SpellViewModel spellVM)
        {
            var domainModel = spellVM.ToDomainModel();
            if (spellVM.SpellId > 0) // editing an existing feature
            {
                //make sure they're the author of this feature
                var existingSpell = await this.dbCtx.Spells.FirstOrDefaultAsync(f => f.Player.Id == userSession.Player.Id && f.Id == spellVM.SpellId);
                if (existingSpell != null)
                {
                    //yep, it's theirs
                    existingSpell.Delisted = true;
                }
            }
            domainModel.Id = 0;

            dbCtx.Attach(userSession.Player);
            domainModel.Player = userSession.Player;
            domainModel.CreatedAtMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            dbCtx.Spells.Add(domainModel);

            await dbCtx.SaveChangesAsync();

            domainModel.Player = userSession.Player;

            return domainModel.ToViewModel();
        }
        

        [HttpPost("~/spells/search")]
        public List<SpellViewModel> SearchSpells([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            var query = dbCtx.Spells.Include(f => f.Player).Where(f => !f.Delisted && f.Name.ToLower().Contains(input.Name.ToLower()));
            switch (input.SearchMode)
            {
                case SearchMode.JustCommunity:
                    query = query.Where(f => f.Player.Id != Player.TheGameMasterId);
                    query = query.OrderByVotes();
                    break;
                case SearchMode.JustOfficial:
                    query = query.Where(f => f.Player.Id == Player.TheGameMasterId);
                    query = query.OrderBy(f => f.Name);
                    break;
                case SearchMode.All:
                default:
                    query = query.OrderByVotes();
                    break;
            }
            query = query.Skip(input.Skip).Take(input.Take);
            return query.Select(s => s.ToViewModel()).ToList();
        }
    }
}