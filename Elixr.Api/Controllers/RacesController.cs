using System.Linq;
using System.Collections.Generic;
using System;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Elixr.Api.ViewModels;
using Elixr.Api.ViewModels.Extensions;
using Elixr.Api.Services;
using Elixr.Api.ApiModels;
using Elixr.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Elixr.Api.Controllers
{
    public class RacesController
    {
        ElixrDbContext dbCtx;
        UserSession userSession;

        public RacesController(ElixrDbContext dbCtx, UserSession userSession)
        {
            this.dbCtx = dbCtx;
            this.userSession = userSession;
        }

        [HttpPost("~/races/create")]
        public async Task<RaceViewModel> CreateRace([FromBody]RaceViewModel raceVM)
        {
            var domainModel = raceVM.ToDomainModel();
            var originalFlawsById = domainModel.FlawInformation.ToDictionary(fi => fi.FlawId, fi => fi.Flaw);
            var originalFeaturesById = domainModel.FeatureInformation.ToDictionary(fi => fi.FeatureId, fi => fi.Feature);
            domainModel.FeatureInformation.ForEach(fi => fi.Feature = null);
            domainModel.FlawInformation.ForEach(fi => fi.Flaw = null);

            domainModel.Id = 0;

            if (raceVM.RaceId > 0)
            {
                //make sure they're the author of this race
                var existingRace = await this.dbCtx.Races.FirstOrDefaultAsync(r => r.AuthorId == userSession.Player.Id && r.Id == raceVM.RaceId);
                if (existingRace != null)
                {
                    //yep, it's theirs
                    existingRace.Delisted = true;
                    domainModel.FeatureInformation.ForEach(fi => fi.Id = 0);
                    domainModel.FlawInformation.ForEach(fi => fi.Id = 0);
                }
            }

            dbCtx.Attach(userSession.Player);
            domainModel.Author = userSession.Player;
            domainModel.CreatedAtMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            dbCtx.Races.Add(domainModel);

            await dbCtx.SaveChangesAsync();

            domainModel.Author = userSession.Player;
            domainModel.FeatureInformation.ForEach(fi => fi.Feature = originalFeaturesById[fi.FeatureId]);
            domainModel.FlawInformation.ForEach(fi => fi.Flaw = originalFlawsById[fi.FlawId]);
            return domainModel.ToViewModel();
        }

        [HttpPost("~/races/search")]
        public async Task<List<RaceViewModel>> SearchRaces([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            var query = dbCtx.Races.Where(r => !r.Delisted)
                                    .Include(r => r.Author)
                                    .Include(r => r.FeatureInformation).ThenInclude(fi => fi.Feature).ThenInclude(f => f.Mods)
                                    .Include(r => r.FeatureInformation).ThenInclude(fi => fi.Feature).ThenInclude(f => f.RequiredFlaws)
                                    .Include(r => r.FeatureInformation).ThenInclude(fi => fi.Feature).ThenInclude(f => f.RequiredOaths)
                                    .Include(r => r.FlawInformation).ThenInclude(fi => fi.Flaw).ThenInclude(f => f.Mods)
                                    .AsQueryable();

            if (!string.IsNullOrWhiteSpace(input.Name))
            {
                query = query.Where(r => r.Name.ToLower() == input.Name.ToLower());
            }

            bool orderByVotes = false;
            switch (input.SearchMode)
            {
                case SearchMode.JustCommunity:
                    query = query.Where(f => f.Author.Id != Player.TheGameMasterId);
                    orderByVotes = true;
                    break;
                case SearchMode.JustOfficial:
                    query = query.Where(f => f.Author.Id == Player.TheGameMasterId);
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

            return await query.Select(r => r.ToViewModel()).ToListAsync();
        }
    }
}