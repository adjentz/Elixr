using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Hosting;
using Elixr.Api.Models;

namespace Elixr.Api.Services
{
    public class Seeder
    {
        private enum RequiredFeature
        {
            CatLikeVision,
            SpeakLanguage,
            NimbleFingers,
            NaturalStrength,
            NaturalCharm,
            NaturalAgility,
            NaturalFocus,
            NaturalAdept,
            Dexterous,
            Insightful,
            MinuteBenefits,
            TinyBenefits,
            ShortBenefits,
            LargeBenefits,
            HugeBenefits,
            MassiveBenefits,
        }
        private enum RequiredFlaw
        {
            MinuteDrawbacks,
            TinyDrawbacks,
            ShortDrawbacks,
            LargeDrawbacks,
            HugeDrawbacks,
            MassiveDrawbacks,
            Unappealing,
            WeakConstitution,
            Bulky,
            Gruff
        }

        private long now = 1473303913983;
        private IHostingEnvironment hostingEnvironment;
        private ElixrDbContext dbCtx;
        private readonly ElixrSettings elixrSettings;
        private readonly Utilities utilities;
        public Seeder(ElixrDbContext dbCtx, IHostingEnvironment hostingEnvironment, ElixrSettings elixrSettings, Utilities utilities)
        {
            this.dbCtx = dbCtx;
            this.hostingEnvironment = hostingEnvironment;
            this.elixrSettings = elixrSettings;
            this.utilities = utilities;
        }

        public void Seed()
        {
            string initialCode = "seed.initial";

            if (!dbCtx.SeedInformation.Any(si => si.Code == initialCode))
            {
                Player gameMaster = SeedPlayers();
                SeedSpells(gameMaster);
                var requiredFlaws = SeedFlaws(gameMaster);
                var requiredFeatures = SeedFeatures(gameMaster, requiredFlaws);
                SeedRaces(gameMaster, requiredFeatures, requiredFlaws);

                Elixr.Api.ApiModels.SeedInfo seedInfo = new Elixr.Api.ApiModels.SeedInfo
                {
                    Code = initialCode,
                    PerformedAtMS = System.DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                };
                dbCtx.SeedInformation.Add(seedInfo);
            }

            dbCtx.SaveChanges();
        }

        private string GetDescriptionFor(string folder, string file)
        {
            string path = Path.Combine(hostingEnvironment.ContentRootPath, "Content", folder, file);
            return File.ReadAllText(path);
        }

        private Player SeedPlayers()
        {
            Player player = new Player();
            player.Name = "The Game Master";
            player.Email = "elixrrpg@gmail.com";
            player.SecurityHash = utilities.HashText(elixrSettings.GameMasterPassword);
            dbCtx.Players.Add(player);

            return player;
        }


        private void SeedRaces(Player gameMaster, Dictionary<RequiredFeature, Feature> requiredFeatures, Dictionary<RequiredFlaw, Flaw> requiredFlaws)
        {
            var speakLanguageFeature = requiredFeatures[RequiredFeature.SpeakLanguage];
            var catLikeVision = requiredFeatures[RequiredFeature.CatLikeVision];
            var nimbleFingers = requiredFeatures[RequiredFeature.NimbleFingers];
            var insightful = requiredFeatures[RequiredFeature.Insightful];
            var dexterous = requiredFeatures[RequiredFeature.Dexterous];
            var naturalAgility = requiredFeatures[RequiredFeature.NaturalAgility];
            var naturalCharm = requiredFeatures[RequiredFeature.NaturalCharm];
            var naturalFocus = requiredFeatures[RequiredFeature.NaturalFocus];
            var naturalStrength = requiredFeatures[RequiredFeature.NaturalStrength];
            //size based
            //flaws
            var shortDrawbacks = requiredFlaws[RequiredFlaw.ShortDrawbacks];
            var tinyDrawbacks = requiredFlaws[RequiredFlaw.TinyDrawbacks];
            var minuteDrawbacks = requiredFlaws[RequiredFlaw.MinuteDrawbacks];
            var largeDrawbacks = requiredFlaws[RequiredFlaw.LargeDrawbacks];
            var hugeDrawbacks = requiredFlaws[RequiredFlaw.HugeDrawbacks];
            var massiveDrawbacks = requiredFlaws[RequiredFlaw.MassiveDrawbacks];
            //features
            var shortBenefits = requiredFeatures[RequiredFeature.ShortBenefits];
            var tinyBenefits = requiredFeatures[RequiredFeature.TinyBenefits];
            var minuteBenefits = requiredFeatures[RequiredFeature.MinuteBenefits];
            var largeBenefits = requiredFeatures[RequiredFeature.LargeBenefits];
            var hugeBenefits = requiredFeatures[RequiredFeature.HugeBenefits];
            var massiveBenefits = requiredFeatures[RequiredFeature.MassiveBenefits];

            var unappealingFlaw = requiredFlaws[RequiredFlaw.Unappealing];
            var weakConstitution = requiredFlaws[RequiredFlaw.WeakConstitution];
            var bulky = requiredFlaws[RequiredFlaw.Bulky];
            var gruff = requiredFlaws[RequiredFlaw.Gruff];

            string racesFolder = "Races";
            List<Race> races = new List<Race>();

            Race dwarf = new Race();
            dwarf.AuthorId = gameMaster.Id;
            dwarf.Name = "Dwarf";
            dwarf.Description = GetDescriptionFor(racesFolder, "dwarf.md");
            dwarf.FlawInformation.Add(new FlawInfo { FlawId = bulky.Id });
            dwarf.FlawInformation.Add(new FlawInfo { FlawId = gruff.Id });
            dwarf.FeatureInformation.Add(new FeatureInfo
            {
                FeatureId = speakLanguageFeature.Id,
                Notes = "Dwarvish"
            });
            dwarf.FeatureInformation.Add(new FeatureInfo
            {
                FeatureId = catLikeVision.Id,
            });
            dwarf.FeatureInformation.Add(new FeatureInfo { FeatureId = naturalStrength.Id });
            races.Add(dwarf);

            Race elf = new Race();
            elf.AuthorId = gameMaster.Id;
            elf.Name = "Elf";
            elf.Description = GetDescriptionFor(racesFolder, "elf.md");
            elf.FlawInformation.Add(new FlawInfo { FlawId = weakConstitution.Id });
            elf.FeatureInformation.Add(new FeatureInfo { FeatureId = speakLanguageFeature.Id, Notes = "Elvish" });
            elf.FeatureInformation.Add(new FeatureInfo { FeatureId = naturalAgility.Id });
            races.Add(elf);

            Race gnome = new Race();
            gnome.AuthorId = gameMaster.Id;
            gnome.Name = "Gnome";
            gnome.Description = GetDescriptionFor(racesFolder, "gnome.md");
            gnome.FlawInformation.Add(new FlawInfo { FlawId = shortDrawbacks.Id });
            gnome.FeatureInformation.Add(new FeatureInfo { FeatureId = shortBenefits.Id });
            gnome.FeatureInformation.Add(new FeatureInfo { FeatureId = speakLanguageFeature.Id, Notes = "Gnomish" });
            gnome.FeatureInformation.Add(new FeatureInfo { FeatureId = nimbleFingers.Id });
            gnome.FeatureInformation.Add(new FeatureInfo { FeatureId = catLikeVision.Id });
            gnome.FeatureInformation.Add(new FeatureInfo { FeatureId = naturalFocus.Id });
            races.Add(gnome);

            Race halfling = new Race();
            halfling.AuthorId = gameMaster.Id;
            halfling.Name = "Halfling";
            halfling.Description = GetDescriptionFor(racesFolder, "halfling.md");
            halfling.FlawInformation.Add(new FlawInfo { FlawId = shortDrawbacks.Id });
            halfling.FeatureInformation.Add(new FeatureInfo { FeatureId = shortBenefits.Id });
            halfling.FeatureInformation.Add(new FeatureInfo { FeatureId = dexterous.Id });
            halfling.FeatureInformation.Add(new FeatureInfo { FeatureId = insightful.Id });
            halfling.FeatureInformation.Add(new FeatureInfo { FeatureId = naturalCharm.Id });
            races.Add(halfling);

            Race human = new Race();
            human.AuthorId = gameMaster.Id;
            human.Name = "Human";
            human.Description = GetDescriptionFor(racesFolder, "human.md");
            races.Add(human);

            Race orc = new Race();
            orc.AuthorId = gameMaster.Id;
            orc.Name = "Orc";
            orc.Description = GetDescriptionFor(racesFolder, "orc.md");
            orc.FeatureInformation.Add(new FeatureInfo { FeatureId = speakLanguageFeature.Id, Notes = "Orcish" });
            orc.FeatureInformation.Add(new FeatureInfo { FeatureId = naturalStrength.Id });
            orc.FlawInformation.Add(new FlawInfo
            {
                FlawId = unappealingFlaw.Id
            });

            races.Add(orc);

            foreach (var race in races)
            {
                race.CreatedAtMS = now;
                dbCtx.Races.Add(race);
            }
        }
        private Dictionary<RequiredFeature, Feature> SeedFeatures(Player gameMaster, Dictionary<RequiredFlaw, Flaw> requiredFlaws)
        {
            Dictionary<RequiredFeature, Feature> requiredFeatures = new Dictionary<RequiredFeature, Feature>();

            string featureFolder = "Features";
            List<Feature> features = new List<Feature>();
            Feature feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 4;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "animal-companion-small.md");
            feature.Name = "Animal Companion, Small";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 6;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "animal-companion-medium.md");
            feature.Name = "Animal Companion, medium";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 8;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "animal-companion-large.md");
            feature.Name = "Animal Companion, large";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Spell;
            feature.CanBeTakenEachLevel = true;
            feature.MustSacrificeEnergy = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "at-will-spell.md");
            feature.Name = "At Will Spell";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 8;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "cohort.md");
            feature.Name = "Cohort";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "dodge.md");
            feature.Name = "Dodge";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 1,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Dodge",
                Stat = Stat.Defense
            });
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 11;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "fast-healing.md");
            feature.Name = "Fast Healing";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 18;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "fly.md");
            feature.Name = "Fly";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 2;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "haste.md");
            feature.Name = "Haste";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 1,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Haste",
                Stat = Stat.Initiative
            });
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 16;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "immunity.md");
            feature.Name = "Immunity, Energy";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "learn-spell.md");
            feature.Name = "Learn Spell";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 9;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "leech.md");
            feature.Name = "Leech";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 12;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "resistance-energy.md");
            feature.Name = "Resistance, Energy";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 20;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "resistance-physical.md");
            feature.Name = "Resistance, Physical";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Spell;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 2;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "silent-spell.md");
            feature.Name = "Silent Spell";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 2;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "skill-training.md");
            feature.Name = "Skill Training";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "speak-language.md");
            feature.Name = "Speak Language";
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.SpeakLanguage, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 7;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "speed.md");
            feature.Name = "Speed";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 10,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Speed",
                Stat = Stat.Speed
            });
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Spell;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 2;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "still-spell.md");
            feature.Name = "Still Spell";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 4;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "two-weapon-training.md");
            feature.Name = "Two Weapon Training";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "vitality.md");
            feature.Name = "Vitality";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "wealth-major.md");
            feature.Name = "Wealth, Major";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 200,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Wealth, Major",
                Stat = Stat.Wealth
            });
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "wealth-minor.md");
            feature.Name = "Wealth, Minor";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 50,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Wealth, Minor",
                Stat = Stat.Wealth
            });
            features.Add(feature);


            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Weapon;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 2;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "weapon-specialization.md");
            feature.Name = "Weapon Specialization";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 1,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Weapon Specialization",
                Stat = Stat.WeaponDamageIncrease
            });
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Weapon;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "weapon-training.md");
            feature.Name = "Weapon Training";
            feature.Player = gameMaster;
            feature.Mods.Add(new StatMod
            {
                Modifier = 1,
                ModifierType = ModifierType.Normal,
                Reason = "Feature: Weapon Training",
                Stat = Stat.WeaponAttackIncrease
            });
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "cat-like-vision.md");
            feature.Name = "Catlike Vision";
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.CatLikeVision, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "nimble-fingers.md");
            feature.Name = "Nimble Fingers";
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.NimbleFingers, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "natural-strength.md");
            feature.Name = "Natural Strength";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.SpecialStrengthScore, Modifier = 2, ModifierType = ModifierType.Normal  }
            };

            requiredFeatures.Add(RequiredFeature.NaturalStrength, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "natural-agility.md");
            feature.Name = "Natural Agility";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.SpecialAgilityScore, Modifier = 2, ModifierType = ModifierType.Normal  }
            };
            requiredFeatures.Add(RequiredFeature.NaturalAgility, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "natural-focus.md");
            feature.Name = "Natural Focus";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.SpecialFocusScore, Modifier = 2, ModifierType = ModifierType.Normal  }
            };
            requiredFeatures.Add(RequiredFeature.NaturalFocus, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "natural-charm.md");
            feature.Name = "Natural Charm";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.SpecialCharmScore, Modifier = 2, ModifierType = ModifierType.Normal  }
            };
            requiredFeatures.Add(RequiredFeature.NaturalCharm, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 3;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "natural-adept.md");
            feature.Name = "Natural Adept";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.GenericAbilityPool, Modifier = 2, ModifierType = ModifierType.Normal  }
            };
            requiredFeatures.Add(RequiredFeature.NaturalAdept, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "dexterous.md");
            feature.Name = "Dexterous";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.SleightOfHand, Modifier = 1, ModifierType = ModifierType.Normal  }
            };
            requiredFeatures.Add(RequiredFeature.Dexterous, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = true;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "insightful.md");
            feature.Name = "Insightful";
            feature.Player = gameMaster;
            feature.Mods = new List<StatMod>
            {
                new StatMod { Stat = Stat.Insight, Modifier = 1, ModifierType = ModifierType.Normal  }
            };
            requiredFeatures.Add(RequiredFeature.Insightful, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 1;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "echolocation-20ft.md");
            feature.Name = "Echolocation (20ft)";
            feature.Player = gameMaster;
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 0;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "short-benefits.md");
            feature.Name = "Short Benefits";
            feature.RequiredFlaws = new List<Flaw> { requiredFlaws[RequiredFlaw.ShortDrawbacks] };
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.ShortBenefits, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 0;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "tiny-benefits.md");
            feature.Name = "Tiny Benefits";
            feature.RequiredFlaws = new List<Flaw> { requiredFlaws[RequiredFlaw.TinyDrawbacks] };
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.TinyBenefits, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 0;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "minute-benefits.md");
            feature.Name = "Minute Benefits";
            feature.RequiredFlaws = new List<Flaw> { requiredFlaws[RequiredFlaw.MinuteDrawbacks] };
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.MinuteBenefits, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 0;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "large-benefits.md");
            feature.Name = "Large Benefits";
            feature.RequiredFlaws = new List<Flaw> { requiredFlaws[RequiredFlaw.LargeDrawbacks] };
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.LargeBenefits, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 0;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "huge-benefits.md");
            feature.Name = "Huge Benefits";
            feature.RequiredFlaws = new List<Flaw> { requiredFlaws[RequiredFlaw.HugeDrawbacks] };
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.HugeBenefits, feature);
            features.Add(feature);

            feature = new Feature();
            feature.ApplyType = FeatureApplyingType.Self;
            feature.CanBeTakenEachLevel = false;
            feature.Cost = 0;
            feature.CreatedAtMS = now;
            feature.Description = GetDescriptionFor(featureFolder, "massive-benefits.md");
            feature.Name = "Massive Benefits";
            feature.RequiredFlaws = new List<Flaw> { requiredFlaws[RequiredFlaw.MassiveDrawbacks] };
            feature.Player = gameMaster;
            requiredFeatures.Add(RequiredFeature.MassiveBenefits, feature);
            features.Add(feature);

            features.ForEach(f => dbCtx.Features.Add(f));

            return requiredFeatures;
        }

        private Dictionary<RequiredFlaw, Flaw> SeedFlaws(Player gameMaster)
        {
            Dictionary<RequiredFlaw, Flaw> flawsByRequired = new Dictionary<RequiredFlaw, Flaw>();

            List<Flaw> flaws = new List<Flaw>();
            Flaw flaw = new Flaw
            {
                Name = "Short Drawbacks",
                Description = GetDescriptionFor("Flaws", "short-drawbacks.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod>
                {
                     new StatMod
                     {
                          Stat = Stat.Speed,
                          Modifier = -10,
                          Reason = "Flaw: Short Drawbacks"
                     },
                     new StatMod
                     {
                          Stat = Stat.SpecialStrengthScore,
                          Modifier = -2,
                          Reason = "Flaw: Short Drawbacks"
                     },
                }
            };
            flawsByRequired.Add(RequiredFlaw.ShortDrawbacks, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Tiny Drawbacks",
                Description = GetDescriptionFor("Flaws", "tiny-drawbacks.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod>
                {
                     new StatMod
                     {
                          Stat = Stat.Speed,
                          Modifier = -20,
                          Reason = "Flaw: Tiny Drawbacks"
                     },
                     new StatMod
                     {
                          Stat = Stat.SpecialStrengthScore,
                          Modifier = -4,
                          Reason = "Flaw: Tiny Drawbacks"
                     },
                }
            };
            flawsByRequired.Add(RequiredFlaw.TinyDrawbacks, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Minute Drawbacks",
                Description = GetDescriptionFor("Flaws", "minute-drawbacks.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod>
                {
                     new StatMod
                     {
                          Stat = Stat.Speed,
                          Modifier = -40,
                          Reason = "Flaw: Minute Drawbacks"
                     },
                     new StatMod
                     {
                          Stat = Stat.SpecialStrengthScore,
                          Modifier = -8,
                          Reason = "Flaw: Minute Drawbacks"
                     },
                }
            };
            flawsByRequired.Add(RequiredFlaw.MinuteDrawbacks, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Large Drawbacks",
                Description = GetDescriptionFor("Flaws", "large-drawbacks.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod>
                {
                     new StatMod
                     {
                          Stat = Stat.SpecialAgilityScore,
                          Modifier = -2,
                          Reason = "Flaw: Large Drawbacks"
                     },
                }
            };
            flawsByRequired.Add(RequiredFlaw.LargeDrawbacks, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Huge Drawbacks",
                Description = GetDescriptionFor("Flaws", "huge-drawbacks.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod>
                {
                     new StatMod
                     {
                          Stat = Stat.SpecialAgilityScore,
                          Modifier = -4,
                          Reason = "Flaw: Huge Drawbacks"
                     },
                }
            };
            flawsByRequired.Add(RequiredFlaw.HugeDrawbacks, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Massive Drawbacks",
                Description = GetDescriptionFor("Flaws", "massive-drawbacks.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod>
                {
                     new StatMod
                     {
                          Stat = Stat.SpecialAgilityScore,
                          Modifier = -2,
                          Reason = "Flaw: Massive Drawbacks"
                     },
                }
            };
            flawsByRequired.Add(RequiredFlaw.MassiveDrawbacks, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Unappealing",
                Description = GetDescriptionFor("Flaws", "unappealing.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod> { new StatMod { Stat = Stat.SpecialCharmScore, Modifier = -2, Reason = "Flaw: Unappealing" } }
            };
            flawsByRequired.Add(RequiredFlaw.Unappealing, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Weak Constitution",
                Description = GetDescriptionFor("Flaws", "weak-constitution.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod> { new StatMod { Stat = Stat.MaxEnergy, Modifier = -2, Reason = "Flaw: Weak Constitution" } }
            };
            flawsByRequired.Add(RequiredFlaw.WeakConstitution, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Bulky",
                Description = GetDescriptionFor("Flaws", "bulky.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod> { new StatMod { Stat = Stat.Speed, Modifier = -5, Reason = "Flaw: Bulky" } }
            };
            flawsByRequired.Add(RequiredFlaw.Bulky, flaw);
            flaws.Add(flaw);

            flaw = new Flaw
            {
                Name = "Gruff",
                Description = GetDescriptionFor("Flaws", "gruff.md"),
                CreatedAtMS = now,
                Player = gameMaster,
                Mods = new List<StatMod> { new StatMod { Stat = Stat.SpecialCharmScore, Modifier = -2, Reason = "Flaw: Gruff" } }
            };
            flawsByRequired.Add(RequiredFlaw.Gruff, flaw);
            flaws.Add(flaw);

            flaws.ForEach(f => this.dbCtx.Add(f));

            return flawsByRequired;
        }
        private void SeedSpells(Player gameMaster)
        {
            const string spellsFolder = "Spells";
            List<Spell> spells = new List<Spell>();
            Spell spell = new Spell();
            spell.Name = "Automate";
            spell.Description = GetDescriptionFor(spellsFolder, "automate.md");
            spell.EnergyCost = "1 per hour ";
            spell.RegenTimeInRounds = 1;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Clairvoyance";
            spell.Description = GetDescriptionFor(spellsFolder, "clairvoyance.md");
            spell.EnergyCost = "Up to your Current Energy";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 60;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Compel";
            spell.Description = GetDescriptionFor(spellsFolder, "compel.md");
            spell.EnergyCost = "1 per 1d6 you wish to roll to overcome the target's Concentration Defense.";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Conjure Object";
            spell.Description = GetDescriptionFor(spellsFolder, "conjure-object.md");
            spell.EnergyCost = "1 per 10 pounds of mass created";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Divinate";
            spell.Description = GetDescriptionFor(spellsFolder, "divinate.md");
            spell.EnergyCost = "Up to your Current Energy";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 60;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Energy Blast";
            spell.Description = GetDescriptionFor(spellsFolder, "energy-blast.md");
            spell.EnergyCost = "Up to your Current Energy";
            spell.RegenTimeInRounds = 1;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Fly";
            spell.Description = GetDescriptionFor(spellsFolder, "fly.md");
            spell.EnergyCost = "2 per 10ft you want to be able to fly in a round";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Illusion";
            spell.Description = GetDescriptionFor(spellsFolder, "illusion.md");
            spell.EnergyCost = "1 per 1d6 you wish to roll to overcome the target's Concentration Defense";
            spell.RegenTimeInRounds = 0;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Invisibility";
            spell.Description = GetDescriptionFor(spellsFolder, "invisibility.md");
            spell.EnergyCost = "1 per creature made Invisible. Spending more Energy makes it less likely to be seen through other magical effects.";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Mind Read";
            spell.Description = GetDescriptionFor(spellsFolder, "mind-read.md");
            spell.EnergyCost = "1 per 1d6 you wish to roll to overcome the target's Concentration Defense";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Necromancy";
            spell.Description = GetDescriptionFor(spellsFolder, "necromancy.md");
            spell.EnergyCost = "Equal to the number of days you wish the undead to remain animated + the level each of the deceased had in life, minimum of 1";
            spell.RegenTimeInRounds = 10;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Plane Shift";
            spell.Description = GetDescriptionFor(spellsFolder, "plane-shift.md");
            spell.EnergyCost = "14";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Resurrect";
            spell.Description = GetDescriptionFor(spellsFolder, "resurrect.md");
            spell.EnergyCost = "Up to your Current Energy";
            spell.RegenTimeInRounds = Spell.SeeDescriptionRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Reveal";
            spell.Description = GetDescriptionFor(spellsFolder, "reveal.md");
            spell.EnergyCost = "Up to your Current Energy";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Speak With Entity";
            spell.Description = GetDescriptionFor(spellsFolder, "speak-with-entity.md");
            spell.EnergyCost = "1 per minute you wish to spend talking";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Spider Walk";
            spell.Description = GetDescriptionFor(spellsFolder, "spider-walk.md");
            spell.EnergyCost = "1 per 10ft of surface you wish to Spider Walk";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Telekinesis";
            spell.Description = GetDescriptionFor(spellsFolder, "telekinesis.md");
            spell.EnergyCost = "1 per 10 pounds moved";
            spell.RegenTimeInRounds = Spell.SeeDescriptionRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Teleport";
            spell.Description = GetDescriptionFor(spellsFolder, "teleport.md");
            spell.EnergyCost = "1 per 100ft travelled";
            spell.RegenTimeInRounds = 10;
            spell.MovementCost = 60;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Tongues";
            spell.Description = GetDescriptionFor(spellsFolder, "tongues.md");
            spell.EnergyCost = "2";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Transmute Object";
            spell.Description = GetDescriptionFor(spellsFolder, "transmute-object.md");
            spell.EnergyCost = "1 per 5 pounds of mass transmuted";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            spell = new Spell();
            spell.Name = "Wild Shape";
            spell.Description = GetDescriptionFor(spellsFolder, "wild-shape.md");
            spell.EnergyCost = "Equal to level of creature";
            spell.RegenTimeInRounds = Spell.ConcentrationRegen;
            spell.MovementCost = 30;
            spells.Add(spell);

            foreach (var item in spells)
            {
                item.Player = gameMaster;
                item.CreatedAtMS = now;
                dbCtx.Spells.Add(item);
            }
        }
    }
}