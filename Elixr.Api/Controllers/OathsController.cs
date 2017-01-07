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
    public class OathsController
    {
        ElixrDbContext dbCtx;
        UserSession userSession;

        public OathsController(ElixrDbContext dbCtx, UserSession userSession)
        {
            this.dbCtx = dbCtx;
            this.userSession = userSession;
        }

        [HttpPost("~/oaths/create")]
        public async Task<OathViewModel> CreateOath([FromBody]OathViewModel oathVM)
        {
            var domainModel = oathVM.ToDomainModel();
            if (oathVM.OathId > 0) // editing an existing feature
            {
                //make sure they're the author of this feature
                var existingOath = await this.dbCtx.Oaths.FirstOrDefaultAsync(f => f.Player.Id == userSession.Player.Id && f.Id == oathVM.OathId);
                if (existingOath != null)
                {
                    //yep, it's theirs
                    existingOath.Delisted = true;
                }
            }

            domainModel.Id = 0;

            dbCtx.Attach(userSession.Player);
            domainModel.Player = userSession.Player;
            domainModel.CreatedAtMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            dbCtx.Oaths.Add(domainModel);
            
            await dbCtx.SaveChangesAsync();

            domainModel.Player = userSession.Player;

            return domainModel.ToViewModel();
        }

        [HttpPost("~/oaths/search")]
        public async Task<List<OathViewModel>> SearchOaths([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            var query = dbCtx.Oaths.Include(o => o.Player).Where(o => !o.Delisted && o.Name.ToLower().Contains(input.Name.ToLower()));
            bool orderByVotes = false;
            switch (input.SearchMode)
            {
                case SearchMode.JustCommunity:
                    query = query.Where(o => o.Player.Id != Player.TheGameMasterId);
                    orderByVotes = true;
                    break;
                case SearchMode.JustOfficial:
                    query = query.Where(o => o.Player.Id == Player.TheGameMasterId);
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
                query = query.OrderBy(o => o.Name);
            }

            query = query.Skip(input.Skip).Take(input.Take);
            
            var results = await query.Select(o => new
            {
                Oath = o,
                Mods = o.Mods
            }).ToListAsync();

            results.ForEach(r => r.Oath.Mods = r.Mods);

            return results.Select(r => r.Oath.ToViewModel()).ToList();
        }
    }
}