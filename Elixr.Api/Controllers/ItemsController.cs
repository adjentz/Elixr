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
    public class ItemsController
    {
        ElixrDbContext dbCtx;
        UserSession userSession;

        public ItemsController(ElixrDbContext dbCtx, UserSession userSession)
        {
            this.dbCtx = dbCtx;
            this.userSession = userSession;
        }

        [HttpPost("~/items/create")]
        public async Task<ItemViewModel> CreateItem([FromBody]ItemViewModel itemVM)
        {
            var domainModel = itemVM.ToDomainModel();
            if (itemVM.EquipmentId > 0) // editing an existing feature
            {
                //make sure they're the author of this feature
                var existingItem = await this.dbCtx.Items.FirstOrDefaultAsync(f => f.Player.Id == userSession.Player.Id && f.Id == itemVM.EquipmentId);
                if (existingItem != null)
                {
                    //yep, it's theirs
                    existingItem.Delisted = true;
                }
            }
            domainModel.Id = 0;

            dbCtx.Attach(userSession.Player);
            domainModel.Player = userSession.Player;
            domainModel.CreatedAtMS = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

            Dictionary<int, Spell> realSpellsById = new Dictionary<int, Spell>();

            foreach (var enchantment in domainModel.Enchantments)
            {
                if (!realSpellsById.ContainsKey(enchantment.BaseSpell.Id))
                {
                    realSpellsById.Add(enchantment.BaseSpell.Id, enchantment.BaseSpell);
                }

                enchantment.Id = 0;
                Spell dummySpell = new Spell
                {
                    Id = enchantment.BaseSpell.Id
                };
                dbCtx.Attach(dummySpell);
                enchantment.BaseSpell = dummySpell;
            }
            dbCtx.Items.Add(domainModel);

            await dbCtx.SaveChangesAsync();

            domainModel.Player = userSession.Player;
            foreach (var enchantment in domainModel.Enchantments)
            {
                enchantment.BaseSpell = realSpellsById[enchantment.BaseSpell.Id];
                enchantment.BaseSpell.Player = userSession.Player;
            }

            return domainModel.ToViewModel();
        }

        [HttpGet("~/items/enchantments/{itemId}")]
        public async Task<List<EnchantmentViewModel>> EnchantmentsForItem(int itemId)
        {
            var enchantmentInfoForItem = await dbCtx.Items
                                            .Include(i => i.Enchantments)
                                            .ThenInclude(e => e.BaseSpell)
                                            .ThenInclude(s => s.Player)
                                            .Where(i => i.Id == itemId)
                                            .Select(i => new
                                            {
                                                Enchantments = i.Enchantments,
                                                SpellsByEnchantmentId = i.Enchantments.Select(e => new
                                                {
                                                    EnchantmentId = e.Id,
                                                    Spell = e.BaseSpell
                                                })
                                                .ToDictionary(a => a.EnchantmentId, a => a.Spell),
                                                PlayersByEnchantmentId = i.Enchantments.Select(e => new
                                                {
                                                    EnchantmentId = e.Id,
                                                    Player = i.Player
                                                }).ToDictionary(a => a.EnchantmentId, a => a.Player)
                                            }).ToListAsync();

            foreach (var info in enchantmentInfoForItem)
            {
                foreach (var enchantment in info.Enchantments)
                {
                    enchantment.BaseSpell = info.SpellsByEnchantmentId[enchantment.Id];
                    enchantment.BaseSpell.Player = info.PlayersByEnchantmentId[enchantment.Id];
                }
            }
            return enchantmentInfoForItem.SelectMany(ei => ei.Enchantments).Select(e => e.ToViewModel()).ToList();
        }

        [HttpPost("~/items/search")]
        public async Task<List<ItemViewModel>> SearchItems([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            var query = dbCtx.Items.Include(f => f.Player).Where(f => !f.Delisted && f.Name.ToLower().Contains(input.Name.ToLower()));
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

            var result = await query.ToListAsync();
            return result.Select(i => i.ToViewModel()).ToList();
        }
    }
}