using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Elixr.Api.ViewModels;
using Elixr.Api.ViewModels.Extensions;
using Elixr.Api.Services;
using Elixr.Api.ApiModels;
using Elixr.Api.Models;
using Microsoft.AspNetCore.Cors;
using System;
using Microsoft.EntityFrameworkCore;

namespace Elixr.Api.Controllers
{
    [EnableCors("AllowAll")]
    public class FlawsController
    {
        ElixrDbContext dbCtx;
        UserSession userSession;

        public FlawsController(ElixrDbContext dbCtx, UserSession userSession)
        {
            this.dbCtx = dbCtx;
            this.userSession = userSession;
        }

        [HttpPost("~/flaws/create")]
        public async Task<FlawViewModel> CreateFlaw([FromBody]FlawViewModel flawVM)
        {
            var domainModel = flawVM.ToDomainModel();
            if (flawVM.FlawId > 0) // editing an existing feature
            {
                //make sure they're the author of this feature
                var existingFlaw = await this.dbCtx.Flaws.FirstOrDefaultAsync(f => f.Player.Id == userSession.Player.Id && f.Id == flawVM.FlawId);
                if (existingFlaw != null)
                {
                    //yep, it's theirs
                    existingFlaw.Delisted = true;
                }
            }

            domainModel.Id = 0;

            dbCtx.Attach(userSession.Player);
            domainModel.Player = userSession.Player;
            domainModel.CreatedAtMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            dbCtx.Flaws.Add(domainModel);

            await dbCtx.SaveChangesAsync();

            domainModel.Player = userSession.Player;

            return domainModel.ToViewModel();
        }

        [HttpPost("~/flaws/search")]
        public async Task<List<FlawViewModel>> SearchFlaws([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            var query = dbCtx.Flaws.Include(f => f.Player).Where(f => !f.Delisted && f.Name.ToLower().Contains(input.Name.ToLower()));
            bool orderByVotes = false;
            switch (input.SearchMode)
            {
                case SearchMode.JustCommunity:
                    query = query.Where(f => f.Player.Id != Player.TheGameMasterId);
                    orderByVotes = true;
                    break;
                case SearchMode.JustOfficial:
                    query = query.Where(f => f.Player.Id == Player.TheGameMasterId);
                    orderByVotes = false;
                    break;
                case SearchMode.All:
                default:
                    orderByVotes = true;
                    break;
            }

            if (orderByVotes)
            {
                query = query.OrderByVotes();
            }
            else
            {
                query = query.OrderBy(f => f.Name);
            }

            query = query.Skip(input.Skip).Take(input.Take);

            var results = await query.Select(f => new
            {
                Flaw = f,
                Mods = f.Mods
            }).ToListAsync();
            results.ForEach(r => r.Flaw.Mods = r.Mods);
            return results.Select(r => r.Flaw.ToViewModel()).ToList();
        }
    }
}