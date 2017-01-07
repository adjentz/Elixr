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
    public class FeaturesController
    {
        ElixrDbContext dbCtx;
        UserSession userSession;

        public FeaturesController(ElixrDbContext dbCtx, UserSession userSession)
        {
            this.dbCtx = dbCtx;
            this.userSession = userSession;
        }

        [HttpPost("~/features/create")]
        public async Task<FeatureViewModel> CreateFeature([FromBody]FeatureViewModel featureVM)
        {
            var domainModel = featureVM.ToDomainModel();
            if (featureVM.FeatureId > 0) // editing an existing feature
            {
                //make sure they're the author of this feature
                var existingFeature = await this.dbCtx.Features.FirstOrDefaultAsync(f => f.Player.Id == userSession.Player.Id && f.Id == featureVM.FeatureId);
                if (existingFeature != null)
                {
                    //yep, it's theirs
                    existingFeature.Delisted = true;
                }
            }

            domainModel.Id = 0;

            domainModel.RequiredFlaws.ForEach(f => dbCtx.Attach(f));
            domainModel.RequiredOaths.ForEach(o => dbCtx.Attach(o));

            dbCtx.Attach(userSession.Player);
            domainModel.Player = userSession.Player;
            domainModel.CreatedAtMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            dbCtx.Features.Add(domainModel);


            await dbCtx.SaveChangesAsync();

            domainModel.Player = userSession.Player;

            return domainModel.ToViewModel();
        }

        [HttpPost("~/features/search")]
        public async Task<List<FeatureViewModel>> SearchFeatures([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            var query = dbCtx.Features.Include(f => f.Player)
                             .Where(f => !f.Delisted && f.Name.ToLower().Contains(input.Name.ToLower()));
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
                Feature = f,
                RequiredOaths = f.RequiredOaths,
                RequiredFlaws = f.RequiredFlaws,
                Mods = f.Mods
            }).ToListAsync();

            results.ForEach(r =>
            {
                r.Feature.RequiredFlaws = r.RequiredFlaws;
                r.Feature.RequiredOaths = r.RequiredOaths;
                r.Feature.Mods = r.Mods;
            });

            return results.Select(r => r.Feature.ToViewModel()).ToList();
        }
    }
}