using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Elixr.Api;
using Elixr.Api.Models;

namespace Elixr.Api.Migrations
{
    [DbContext(typeof(ElixrDbContext))]
    [Migration("20170205045822_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "1.1.0-rtm-22752");

            modelBuilder.Entity("Elixr.Api.ApiModels.SeedInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Code");

                    b.Property<long>("PerformedAtMS");

                    b.HasKey("Id");

                    b.ToTable("SeedInformation");
                });

            modelBuilder.Entity("Elixr.Api.Models.Armor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<float>("Cost");

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<string>("ImageUrl");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("UpVotes");

                    b.Property<float>("WeightInPounds");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("Armor");
                });

            modelBuilder.Entity("Elixr.Api.Models.ArmorInfo", b =>
                {
                    b.Property<int>("ArmorInfoId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ArmorId");

                    b.Property<int?>("CreatureId");

                    b.Property<int>("Id");

                    b.Property<string>("Notes");

                    b.HasKey("ArmorInfoId");

                    b.HasIndex("ArmorId");

                    b.HasIndex("CreatureId");

                    b.ToTable("ArmorInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.Creature", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Age");

                    b.Property<int?>("AuthorId");

                    b.Property<long>("CreatedAtMS");

                    b.Property<string>("CurrentEnergyLedger");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<string>("Eyes");

                    b.Property<string>("Gender");

                    b.Property<string>("Hair");

                    b.Property<string>("Height");

                    b.Property<bool>("IsPlayerCharacter");

                    b.Property<int>("Level");

                    b.Property<string>("Name");

                    b.Property<string>("PortraitUrl");

                    b.Property<int?>("RaceId");

                    b.Property<string>("Skin");

                    b.Property<int>("UpVotes");

                    b.Property<string>("Weight");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.HasIndex("RaceId");

                    b.ToTable("Creatures");
                });

            modelBuilder.Entity("Elixr.Api.Models.Enchantment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ArmorId");

                    b.Property<int?>("BaseSpellId");

                    b.Property<string>("Description");

                    b.Property<int>("EnergyUsedInEnchantment");

                    b.Property<int?>("ItemId");

                    b.Property<string>("MagicDamage");

                    b.Property<string>("Name");

                    b.Property<int>("UsesOrRoundsPerDay");

                    b.Property<int?>("WeaponId");

                    b.HasKey("Id");

                    b.HasIndex("ArmorId");

                    b.HasIndex("BaseSpellId");

                    b.HasIndex("ItemId");

                    b.HasIndex("WeaponId");

                    b.ToTable("Enchantment");
                });

            modelBuilder.Entity("Elixr.Api.Models.Feature", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ApplyType");

                    b.Property<bool>("CanBeTakenEachLevel");

                    b.Property<int>("Cost");

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<bool>("MustSacrificeEnergy");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("UpVotes");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("Features");
                });

            modelBuilder.Entity("Elixr.Api.Models.FeatureInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ArmorInfoId");

                    b.Property<int>("CostWhenTaken");

                    b.Property<int?>("CreatureId");

                    b.Property<int>("EnergySacrificedWhenTaken");

                    b.Property<int>("FeatureId");

                    b.Property<int?>("ItemInfoId");

                    b.Property<string>("Notes");

                    b.Property<int?>("RaceId");

                    b.Property<int?>("SpellInfoId");

                    b.Property<int>("TakenAtLevel");

                    b.Property<int?>("WeaponInfoId");

                    b.HasKey("Id");

                    b.HasIndex("ArmorInfoId");

                    b.HasIndex("CreatureId");

                    b.HasIndex("FeatureId");

                    b.HasIndex("ItemInfoId");

                    b.HasIndex("RaceId");

                    b.HasIndex("SpellInfoId");

                    b.HasIndex("WeaponInfoId");

                    b.ToTable("FeatureInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.Flaw", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<int?>("FeatureId");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("UpVotes");

                    b.HasKey("Id");

                    b.HasIndex("FeatureId");

                    b.HasIndex("PlayerId");

                    b.ToTable("Flaws");
                });

            modelBuilder.Entity("Elixr.Api.Models.FlawInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CreatureId");

                    b.Property<int>("FlawId");

                    b.Property<string>("Notes");

                    b.Property<int?>("RaceId");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.HasIndex("FlawId");

                    b.HasIndex("RaceId");

                    b.ToTable("FlawInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.Item", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<float>("Cost");

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<string>("ImageUrl");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("UpVotes");

                    b.Property<float>("WeightInPounds");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("Items");
                });

            modelBuilder.Entity("Elixr.Api.Models.ItemInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CreatureId");

                    b.Property<int>("ItemId");

                    b.Property<string>("Notes");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.HasIndex("ItemId");

                    b.ToTable("ItemInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.Oath", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<int?>("FeatureId");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("UpVotes");

                    b.HasKey("Id");

                    b.HasIndex("FeatureId");

                    b.HasIndex("PlayerId");

                    b.ToTable("Oaths");
                });

            modelBuilder.Entity("Elixr.Api.Models.OathInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Broken");

                    b.Property<int?>("CreatureId");

                    b.Property<string>("Notes");

                    b.Property<int>("OathId");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.HasIndex("OathId");

                    b.ToTable("OathInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.Player", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Email");

                    b.Property<string>("Name");

                    b.Property<string>("SecurityHash");

                    b.HasKey("Id");

                    b.ToTable("Players");
                });

            modelBuilder.Entity("Elixr.Api.Models.Race", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AuthorId");

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<string>("Name");

                    b.Property<int>("UpVotes");

                    b.HasKey("Id");

                    b.HasIndex("AuthorId");

                    b.ToTable("Races");
                });

            modelBuilder.Entity("Elixr.Api.Models.Skill", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BelongsTo");

                    b.Property<int?>("CreatureId");

                    b.Property<bool>("HasDefense");

                    b.Property<string>("Name");

                    b.Property<int>("Ranks");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.ToTable("Skill");
                });

            modelBuilder.Entity("Elixr.Api.Models.Spell", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<long>("CreatedAtMS");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<string>("EnergyCost");

                    b.Property<int>("MovementCost");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("RegenTimeInRounds");

                    b.Property<int>("UpVotes");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("Spells");
                });

            modelBuilder.Entity("Elixr.Api.Models.SpellInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CreatureId");

                    b.Property<string>("Notes");

                    b.Property<int>("SpellId");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.HasIndex("SpellId");

                    b.ToTable("SpellInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.StatMod", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CreatureId");

                    b.Property<int?>("FeatureId");

                    b.Property<int?>("FlawId");

                    b.Property<float>("Modifier");

                    b.Property<int>("ModifierType");

                    b.Property<int?>("OathId");

                    b.Property<string>("Reason");

                    b.Property<int>("Stat");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.HasIndex("FeatureId");

                    b.HasIndex("FlawId");

                    b.HasIndex("OathId");

                    b.ToTable("StatMod");
                });

            modelBuilder.Entity("Elixr.Api.Models.Weapon", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("AttackAbility");

                    b.Property<float>("Cost");

                    b.Property<long>("CreatedAtMS");

                    b.Property<string>("Damage");

                    b.Property<int>("DamageAbility");

                    b.Property<bool>("Delisted");

                    b.Property<string>("Description");

                    b.Property<int>("DownVotes");

                    b.Property<string>("ImageUrl");

                    b.Property<string>("Name");

                    b.Property<int?>("PlayerId");

                    b.Property<int>("Range");

                    b.Property<int>("UpVotes");

                    b.Property<float>("WeightInPounds");

                    b.HasKey("Id");

                    b.HasIndex("PlayerId");

                    b.ToTable("Weapons");
                });

            modelBuilder.Entity("Elixr.Api.Models.WeaponInfo", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("CreatureId");

                    b.Property<string>("Notes");

                    b.Property<int>("WeaponId");

                    b.HasKey("Id");

                    b.HasIndex("CreatureId");

                    b.HasIndex("WeaponId");

                    b.ToTable("WeaponInfo");
                });

            modelBuilder.Entity("Elixr.Api.Models.Armor", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.ArmorInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.Armor", "Armor")
                        .WithMany()
                        .HasForeignKey("ArmorId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("ArmorInformation")
                        .HasForeignKey("CreatureId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Creature", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId");

                    b.HasOne("Elixr.Api.Models.Race", "Race")
                        .WithMany()
                        .HasForeignKey("RaceId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Enchantment", b =>
                {
                    b.HasOne("Elixr.Api.Models.Armor")
                        .WithMany("Enchantments")
                        .HasForeignKey("ArmorId");

                    b.HasOne("Elixr.Api.Models.Spell", "BaseSpell")
                        .WithMany()
                        .HasForeignKey("BaseSpellId");

                    b.HasOne("Elixr.Api.Models.Item")
                        .WithMany("Enchantments")
                        .HasForeignKey("ItemId");

                    b.HasOne("Elixr.Api.Models.Weapon")
                        .WithMany("Enchantments")
                        .HasForeignKey("WeaponId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Feature", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.FeatureInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.ArmorInfo")
                        .WithMany("FeaturesApplied")
                        .HasForeignKey("ArmorInfoId");

                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("FeatureInformation")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Feature", "Feature")
                        .WithMany()
                        .HasForeignKey("FeatureId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Elixr.Api.Models.ItemInfo")
                        .WithMany("FeaturesApplied")
                        .HasForeignKey("ItemInfoId");

                    b.HasOne("Elixr.Api.Models.Race")
                        .WithMany("FeatureInformation")
                        .HasForeignKey("RaceId");

                    b.HasOne("Elixr.Api.Models.SpellInfo")
                        .WithMany("FeaturesApplied")
                        .HasForeignKey("SpellInfoId");

                    b.HasOne("Elixr.Api.Models.WeaponInfo")
                        .WithMany("FeaturesApplied")
                        .HasForeignKey("WeaponInfoId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Flaw", b =>
                {
                    b.HasOne("Elixr.Api.Models.Feature")
                        .WithMany("RequiredFlaws")
                        .HasForeignKey("FeatureId");

                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.FlawInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("FlawInformation")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Flaw", "Flaw")
                        .WithMany()
                        .HasForeignKey("FlawId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("Elixr.Api.Models.Race")
                        .WithMany("FlawInformation")
                        .HasForeignKey("RaceId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Item", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.ItemInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("ItemInformation")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Item", "Item")
                        .WithMany()
                        .HasForeignKey("ItemId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Elixr.Api.Models.Oath", b =>
                {
                    b.HasOne("Elixr.Api.Models.Feature")
                        .WithMany("RequiredOaths")
                        .HasForeignKey("FeatureId");

                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.OathInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("OathInformation")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Oath", "Oath")
                        .WithMany()
                        .HasForeignKey("OathId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Elixr.Api.Models.Race", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Author")
                        .WithMany()
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Elixr.Api.Models.Skill", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("Skills")
                        .HasForeignKey("CreatureId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Spell", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.SpellInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("SpellInformation")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Spell", "Spell")
                        .WithMany()
                        .HasForeignKey("SpellId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("Elixr.Api.Models.StatMod", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("BaseStats")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Feature")
                        .WithMany("Mods")
                        .HasForeignKey("FeatureId");

                    b.HasOne("Elixr.Api.Models.Flaw")
                        .WithMany("Mods")
                        .HasForeignKey("FlawId");

                    b.HasOne("Elixr.Api.Models.Oath")
                        .WithMany("Mods")
                        .HasForeignKey("OathId");
                });

            modelBuilder.Entity("Elixr.Api.Models.Weapon", b =>
                {
                    b.HasOne("Elixr.Api.Models.Player", "Player")
                        .WithMany()
                        .HasForeignKey("PlayerId");
                });

            modelBuilder.Entity("Elixr.Api.Models.WeaponInfo", b =>
                {
                    b.HasOne("Elixr.Api.Models.Creature")
                        .WithMany("WeaponInformation")
                        .HasForeignKey("CreatureId");

                    b.HasOne("Elixr.Api.Models.Weapon", "Weapon")
                        .WithMany()
                        .HasForeignKey("WeaponId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
        }
    }
}
