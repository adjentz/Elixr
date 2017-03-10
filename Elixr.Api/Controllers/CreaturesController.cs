using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Elixr.Api.ApiModels;
using Elixr.Api.Models;
using Elixr.Api.ViewModels;
using Elixr.Api.ViewModels.Extensions;
using Elixr.Api.Services;

namespace Elixr.Api.Controllers
{
    public class CreaturesController
    {
        ElixrDbContext dbContext;
        UserSession userSession;
        public CreaturesController(ElixrDbContext dbContext, UserSession userSession)
        {
            this.dbContext = dbContext;
            this.userSession = userSession;
        }

        private IQueryable<Creature> CreatureQuery
        {
            get
            {
                return this.dbContext.Creatures.Where(c => !c.Delisted)
                                                 .Include(c => c.Race)
                                                 .Include(c => c.Race).ThenInclude(r => r.FeatureInformation).ThenInclude(fi => fi.Feature).ThenInclude(f => f.RequiredFlaws)
                                                 .Include(c => c.Race).ThenInclude(r => r.FeatureInformation).ThenInclude(fi => fi.Feature).ThenInclude(f => f.RequiredOaths)
                                                 .Include(c => c.Race).ThenInclude(r => r.FlawInformation).ThenInclude(fi => fi.Flaw)
                                                 .Include(c => c.OathInformation).ThenInclude(oi => oi.Oath).ThenInclude(o => o.Mods)
                                                 .Include(c => c.FlawInformation).ThenInclude(fi => fi.Flaw).ThenInclude(f => f.Mods)
                                                 .Include(c => c.FeatureInformation).ThenInclude(fi => fi.Feature).ThenInclude(f => f.Mods)
                                                 .Include(c => c.SpellInformation).ThenInclude(si => si.Spell)
                                                 .Include(c => c.SpellInformation).ThenInclude(si => si.FeaturesApplied).ThenInclude(fi => fi.Feature)
                                                 .Include(c => c.ItemInformation).ThenInclude(ii => ii.Item)
                                                 .Include(c => c.ItemInformation).ThenInclude(ii => ii.FeaturesApplied).ThenInclude(fi => fi.Feature)
                                                 .Include(c => c.WeaponInformation).ThenInclude(wi => wi.Weapon)
                                                 .Include(c => c.WeaponInformation).ThenInclude(wi => wi.FeaturesApplied).ThenInclude(fi => fi.Feature)
                                                 .Include(c => c.ArmorInformation).ThenInclude(ai => ai.Armor)
                                                 .Include(c => c.ArmorInformation).ThenInclude(ai => ai.FeaturesApplied).ThenInclude(fi => fi.Feature)
                                                 .Include(c => c.Skills)
                                                 .Include(c => c.BaseStats)
                                                 .AsQueryable();
            }
        }

        [HttpGet("~/creatures/characters")]
        public async Task<List<CreatureViewModel>> GetPlayersCharacters()
        {
            var query = this.dbContext.Creatures.Where(c => !c.Delisted && c.IsPlayerCharacter && c.Author.Id == userSession.Player.Id)
                                          .OrderBy(c => c.Name);

            return await query.Select(r => r.ToViewModel()).ToListAsync();
        }

        [HttpGet("~/creatures/delete/{creatureId}")]
        public async Task<List<CreatureViewModel>> DeleteCreature(int creatureId)
        {
            var creature = await dbContext.Creatures.FirstOrDefaultAsync(c => c.Id == creatureId && c.Author.Id == userSession.Player.Id);
            if (creature != null)
            {
                creature.Delisted = true;
                await dbContext.SaveChangesAsync();
            }
            var query = this.dbContext.Creatures.Where(c => c.IsPlayerCharacter && c.Author.Id == userSession.Player.Id)
                                          .OrderBy(c => c.Name);

            return await query.Select(r => r.ToViewModel()).ToListAsync();
        }

        [HttpPost("~/creatures/search")]
        public async Task<List<CreatureViewModel>> SearchCreatures([FromBody]SearchInput input)
        {
            if (input.Take > 100)
            {
                return null;
            }

            //For the search, not everything is needed 
            var query = this.dbContext.Creatures.Where(c => !c.Delisted && !c.IsPlayerCharacter).Include(c => c.Author).AsQueryable();

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
            var results = await query.ToListAsync();
            return results.Select(r => r.ToViewModel()).ToList();
        }
        [HttpGet("~/creatures/{creatureId}")]
        public async Task<CreatureViewModel> GetCreature(int creatureId)
        {
            var result = await this.CreatureQuery.SingleOrDefaultAsync(c => c.Id == creatureId);
            return result?.ToViewModel();
        }

        [HttpPost("~/creatures/save")]
        public async Task<int> SaveCreature([FromBody]CreatureEditInput input)
        {
            if(input.IsPlayerCharacter && input.CreatureId == 0)
            {
                if(await dbContext.Creatures.CountAsync(c => !c.Delisted && c.IsPlayerCharacter && c.Author.Id == userSession.Player.Id) >= 6)
                {
                    return 0; //they were warned client-side that the beta only allows six player characters 
                }
            }

            Creature creature = null;
            if (input.CreatureId > 0)
            {
                creature = await this.CreatureQuery.Where(c => c.Author.Id == this.userSession.Player.Id)
                                                    .SingleOrDefaultAsync(c => c.Id == input.CreatureId);
            }
            else
            {
                creature = new Creature();
                creature.CreatedAtMS = System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
                dbContext.Entry(creature).State = EntityState.Added;
                dbContext.Attach(this.userSession.Player);
                creature.Author = this.userSession.Player;
            }

            if (!string.IsNullOrWhiteSpace(input.DescriptionChangedTo))
            {
                creature.Description = input.DescriptionChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.HairChangedTo))
            {
                creature.Hair = input.HairChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.AgeChangedTo))
            {
                creature.Age = input.AgeChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.WeightChangedTo))
            {
                creature.Weight = input.WeightChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.HeightChangedTo))
            {
                creature.Height = input.HeightChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.SkinChangedTo))
            {
                creature.Skin = input.SkinChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.EyesChangedTo))
            {
                creature.Eyes = input.EyesChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.NameChangedTo))
            {
                creature.Name = input.NameChangedTo;
            }
            if (!string.IsNullOrWhiteSpace(input.GenderChangedTo))
            {
                creature.Gender = input.GenderChangedTo;
            }

            if (input.RaceIdChangedTo > 0)
            {
                creature.Race = await dbContext.Races.SingleOrDefaultAsync(r => r.Id == input.RaceIdChangedTo);
            }
            else if(input.RaceIdChangedTo < 0) //-1 means remove Race
            {
                creature.Race = null;
            }

            creature.CurrentEnergyLedger = input.CurrentEnergyLedgerIs;
            creature.Level = input.LevelIs;
            creature.IsPlayerCharacter = input.IsPlayerCharacter;

            foreach (var oathInfoVM in input.NewOathInformation)
            {
                OathInfo oathInfo = new OathInfo
                {
                    Broken = oathInfoVM.Broken,
                    OathId = oathInfoVM.Oath.OathId,
                    Notes = oathInfoVM.Notes
                };
                creature.OathInformation.Add(oathInfo);
            }

            foreach (var featureInfoVM in input.NewFeatureInformation)
            {
                FeatureInfo featureInfo = new FeatureInfo
                {
                    FeatureId = featureInfoVM.Feature.FeatureId,
                    CostWhenTaken = featureInfoVM.CostWhenTaken,
                    EnergySacrificedWhenTaken = featureInfoVM.EnergySacrificedWhenTaken,
                    TakenAtLevel = featureInfoVM.TakenAtLevel,
                    Notes = featureInfoVM.Notes
                };
                if (featureInfoVM.FeatureInfoId > 0)
                {
                    var existingFeatureInfo = creature.FeatureInformation.FirstOrDefault(fi => fi.Id == featureInfoVM.FeatureInfoId);
                    if (existingFeatureInfo != null)
                    {
                        dbContext.Entry(existingFeatureInfo).State = EntityState.Detached;
                        featureInfo.Id = featureInfoVM.FeatureInfoId;
                        dbContext.Attach(featureInfo);
                        dbContext.Entry(featureInfo).State = EntityState.Modified;
                    }
                }
                else
                {
                    creature.FeatureInformation.Add(featureInfo);
                }
            }

            foreach (var itemInfoVM in input.NewItemInformation)
            {
                ItemInfo itemInfo = new ItemInfo
                {
                    ItemId = itemInfoVM.Item.EquipmentId,
                    Notes = itemInfoVM.Notes
                };
                if (itemInfoVM.ItemInfoId > 0)
                {
                    // make sure this actually belongs to this here creature
                    var existingItemInfo = creature.ItemInformation.FirstOrDefault(ii => ii.Id == itemInfoVM.ItemInfoId);
                    if (existingItemInfo != null)
                    {
                        dbContext.Entry(existingItemInfo).State = EntityState.Detached;
                        itemInfo.Id = itemInfoVM.ItemInfoId;
                        dbContext.Attach(itemInfo);
                        dbContext.Entry(itemInfo).State = EntityState.Modified;
                    }
                }
                else
                {
                    creature.ItemInformation.Add(itemInfo);
                }
            }

            foreach (var weaponInfoFeatureChange in input.WeaponFeatureChanges)
            {
                var weaponInfo = creature.WeaponInformation.FirstOrDefault(si => si.Id == weaponInfoFeatureChange.WeaponInfoId);
                if (weaponInfo == null)
                {
                    continue;
                }

                foreach (var featureInfoVM in weaponInfoFeatureChange.NewFeatures)
                {
                    var featureInfo = featureInfoVM.ToDomainModel();
                    featureInfo.Feature = null;
                    weaponInfo.FeaturesApplied.Add(featureInfo);
                }
                weaponInfo.FeaturesApplied.RemoveAll(fi => weaponInfoFeatureChange.DeletedFeatureInfoIds.Contains(fi.Id));
            }

            foreach (var weaponInfoVM in input.NewWeaponInformation)
            {
                WeaponInfo weaponInfo = new WeaponInfo
                {
                    WeaponId = weaponInfoVM.Weapon.EquipmentId,
                    Notes = weaponInfoVM.Notes
                };
                if (weaponInfoVM.WeaponInfoId > 0)
                {
                    // make sure this actually belongs to this here creature
                    var existingWeaponInfo = creature.ItemInformation.FirstOrDefault(ii => ii.Id == weaponInfoVM.WeaponInfoId);
                    if (existingWeaponInfo != null)
                    {
                        dbContext.Entry(existingWeaponInfo).State = EntityState.Detached;
                        weaponInfo.Id = weaponInfoVM.WeaponInfoId;
                        dbContext.Attach(weaponInfo);
                        dbContext.Entry(weaponInfo).State = EntityState.Modified;
                    }
                }
                else
                {
                    foreach (var featureInfoVM in weaponInfoVM.FeaturesApplied)
                    {
                        var featureInfo = featureInfoVM.ToDomainModel();
                        featureInfo.Feature = null;
                        weaponInfo.FeaturesApplied.Add(featureInfo);
                    }
                    creature.WeaponInformation.Add(weaponInfo);
                }
            }

            foreach (var armorInfoVM in input.NewArmorInformation)
            {
                ArmorInfo armorInfo = new ArmorInfo
                {
                    ArmorId = armorInfoVM.Armor.EquipmentId,
                    Notes = armorInfoVM.Notes
                };
                if (armorInfoVM.ArmorInfoId > 0)
                {
                    // make sure this actually belongs to this here creature
                    var existingWeaponInfo = creature.ArmorInformation.FirstOrDefault(ii => ii.Id == armorInfoVM.ArmorInfoId);
                    if (existingWeaponInfo != null)
                    {
                        dbContext.Entry(existingWeaponInfo).State = EntityState.Detached;
                        armorInfo.Id = armorInfoVM.ArmorInfoId;
                        dbContext.Attach(armorInfo);
                        dbContext.Entry(armorInfo).State = EntityState.Modified;
                    }
                }
                else
                {
                    creature.ArmorInformation.Add(armorInfo);
                }
            }


            foreach (var flawInfoVM in input.NewFlawInformation)
            {
                FlawInfo flawInfo = new FlawInfo
                {
                    FlawId = flawInfoVM.Flaw.FlawId,
                    Notes = flawInfoVM.Notes
                };
                if (flawInfoVM.FlawInfoId > 0)
                {
                    // make sure this actually belongs to this here creature
                    var existingFlawInfo = creature.FlawInformation.FirstOrDefault(fi => fi.Id == flawInfoVM.FlawInfoId);
                    if (existingFlawInfo != null)
                    {
                        dbContext.Entry(existingFlawInfo).State = EntityState.Detached;
                        flawInfo.Id = flawInfoVM.FlawInfoId;
                        dbContext.Attach(flawInfo);
                        dbContext.Entry(flawInfo).State = EntityState.Modified;
                    }
                }
                else
                {
                    creature.FlawInformation.Add(flawInfo);
                }
            }

            foreach (var spellInfoFeatureChange in input.SpellFeatureChanges)
            {
                var spellInfo = creature.SpellInformation.FirstOrDefault(si => si.Id == spellInfoFeatureChange.SpellInfoId);
                if (spellInfo == null)
                {
                    continue;
                }

                foreach (var featureInfoVM in spellInfoFeatureChange.NewFeatures)
                {
                    var featureInfo = featureInfoVM.ToDomainModel();
                    featureInfo.Feature = null;
                    spellInfo.FeaturesApplied.Add(featureInfo);
                }
                spellInfo.FeaturesApplied.RemoveAll(fi => spellInfoFeatureChange.DeletedFeatureInfoIds.Contains(fi.Id));
            }

            foreach (var spellInfoVM in input.NewSpellInformation)
            {
                SpellInfo spellInfo = new SpellInfo
                {
                    SpellId = spellInfoVM.Spell.SpellId,
                    Notes = spellInfoVM.Notes,
                    FeaturesApplied = new List<FeatureInfo>()
                };


                if (spellInfoVM.SpellInfoId > 0)
                {
                    var existingSpellInfo = creature.SpellInformation.FirstOrDefault(si => si.Id == spellInfoVM.SpellInfoId);
                    dbContext.Entry(existingSpellInfo).State = EntityState.Detached;
                    spellInfo.Id = existingSpellInfo.Id;
                    dbContext.Attach(spellInfo);

                    dbContext.Entry(spellInfo).State = EntityState.Modified;
                }
                else
                {
                    foreach (var featureInfoVM in spellInfoVM.FeaturesApplied)
                    {
                        var featureInfo = featureInfoVM.ToDomainModel();
                        featureInfo.Feature = null;
                        spellInfo.FeaturesApplied.Add(featureInfo);
                    }
                    creature.SpellInformation.Add(spellInfo);
                }
            }

            foreach (var statModVM in input.NewStatMods)
            {
                var statMod = statModVM.ToDomainModel();
                if (statModVM.StatModId > 0)
                {
                    var existingStatMod = creature.BaseStats.SingleOrDefault(sm => sm.Id == statModVM.StatModId);
                    if (existingStatMod != null) // make sure this stat belongs to this creature
                    {
                        dbContext.Entry(existingStatMod).State = EntityState.Detached;

                        statMod.Id = statModVM.StatModId;
                        dbContext.Attach(statMod);
                        dbContext.Entry(statMod).State = EntityState.Modified;
                    }
                }
                else
                {
                    statMod.Id = 0;
                    creature.BaseStats.Add(statMod);
                }
            }

            foreach (var skillVM in input.NewSkills)
            {
                var skill = new Skill
                {
                    Name = skillVM.Name,
                    Ranks = skillVM.Ranks,
                    BelongsTo = skillVM.BelongsTo,
                    HasDefense = skillVM.HasDefense
                };

                if (skillVM.SkillId > 0)
                {
                    var existingSkill = creature.Skills.SingleOrDefault(s => s.Id == skillVM.SkillId);
                    if (existingSkill != null) //make sure this skill belongs to this creature
                    {
                        dbContext.Entry(existingSkill).State = EntityState.Detached;
                        skill.Id = skillVM.SkillId;
                        dbContext.Attach(skill);
                        dbContext.Entry(skill).State = EntityState.Modified;
                    }
                }
                else
                {
                    creature.Skills.Add(skill);
                }
            }

            creature.FlawInformation.RemoveAll(fi => input.DeletedFlawInformationIds.Contains(fi.Id));
            creature.OathInformation.RemoveAll(oi => input.DeletedOathInformationIds.Contains(oi.Id));
            creature.FeatureInformation.RemoveAll(fi => input.DeletedFeatureInformationIds.Contains(fi.Id));

            creature.WeaponInformation.RemoveAll(wi => input.DeletedWeaponInformationIds.Contains(wi.Id));
            creature.ArmorInformation.RemoveAll(ai => input.DeletedArmorInformationIds.Contains(ai.Id));
            creature.ItemInformation.RemoveAll(ii => input.DeletedArmorInformationIds.Contains(ii.Id));

            creature.SpellInformation.RemoveAll(si => input.DeletedSpellInfoIds.Contains(si.Id));
            creature.Skills.RemoveAll(s => input.DeletedSkillIds.Contains(s.Id));
            creature.BaseStats.RemoveAll(sm => input.DeletedStatModIds.Contains(sm.Id));

            await dbContext.SaveChangesAsync();
            return creature.Id;
        }
    }
}