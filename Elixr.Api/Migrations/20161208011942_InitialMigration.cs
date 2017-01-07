using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Elixr.Api.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SeedInformation",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    Code = table.Column<string>(nullable: true),
                    PerformedAtMS = table.Column<long>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SeedInformation", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Players",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    Email = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    SecurityHash = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Players", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Armor",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    Cost = table.Column<float>(nullable: false),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    ImageUrl = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    UpVotes = table.Column<int>(nullable: false),
                    WeightInPounds = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Armor", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Armor_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Features",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    ApplyType = table.Column<int>(nullable: false),
                    CanBeTakenEachLevel = table.Column<bool>(nullable: false),
                    Cost = table.Column<int>(nullable: false),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    MustSacrificeEnergy = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    UpVotes = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Features", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Features_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    Cost = table.Column<float>(nullable: false),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    ImageUrl = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    UpVotes = table.Column<int>(nullable: false),
                    WeightInPounds = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Items_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Races",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    AuthorId = table.Column<int>(nullable: false),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    UpVotes = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Races", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Races_Players_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Spells",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    EnergyCost = table.Column<string>(nullable: true),
                    MovementCost = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    RegenTimeInRounds = table.Column<int>(nullable: false),
                    UpVotes = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Spells", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Spells_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Weapons",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    AttackAbility = table.Column<int>(nullable: false),
                    Cost = table.Column<float>(nullable: false),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Damage = table.Column<string>(nullable: true),
                    DamageAbility = table.Column<int>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    ImageUrl = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    Range = table.Column<int>(nullable: false),
                    UpVotes = table.Column<int>(nullable: false),
                    WeightInPounds = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Weapons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Weapons_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Flaws",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    FeatureId = table.Column<int>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    UpVotes = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Flaws", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Flaws_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Flaws_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Oaths",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatedAtMS = table.Column<long>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    DownVotes = table.Column<int>(nullable: false),
                    FeatureId = table.Column<int>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    PlayerId = table.Column<int>(nullable: true),
                    UpVotes = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Oaths", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Oaths_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Oaths_Players_PlayerId",
                        column: x => x.PlayerId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Creatures",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    Age = table.Column<string>(nullable: true),
                    AuthorId = table.Column<int>(nullable: true),
                    CurrentEnergyLedger = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Eyes = table.Column<string>(nullable: true),
                    Gender = table.Column<string>(nullable: true),
                    Hair = table.Column<string>(nullable: true),
                    Height = table.Column<string>(nullable: true),
                    IsPlayerCharacter = table.Column<bool>(nullable: false),
                    Level = table.Column<int>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    PortraitUrl = table.Column<string>(nullable: true),
                    RaceId = table.Column<int>(nullable: true),
                    Skin = table.Column<string>(nullable: true),
                    Weight = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Creatures", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Creatures_Players_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "Players",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Creatures_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Enchantment",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    ArmorId = table.Column<int>(nullable: true),
                    BaseSpellId = table.Column<int>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    EnergyUsedInEnchantment = table.Column<int>(nullable: false),
                    ItemId = table.Column<int>(nullable: true),
                    MagicDamage = table.Column<string>(nullable: true),
                    Name = table.Column<string>(nullable: true),
                    UsesOrRoundsPerDay = table.Column<int>(nullable: false),
                    WeaponId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enchantment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Enchantment_Armor_ArmorId",
                        column: x => x.ArmorId,
                        principalTable: "Armor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Enchantment_Spells_BaseSpellId",
                        column: x => x.BaseSpellId,
                        principalTable: "Spells",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Enchantment_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Enchantment_Weapons_WeaponId",
                        column: x => x.WeaponId,
                        principalTable: "Weapons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ArmorInfo",
                columns: table => new
                {
                    ArmorInfoId = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    ArmorId = table.Column<int>(nullable: false),
                    CreatureId = table.Column<int>(nullable: true),
                    Id = table.Column<int>(nullable: false),
                    Notes = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ArmorInfo", x => x.ArmorInfoId);
                    table.ForeignKey(
                        name: "FK_ArmorInfo_Armor_ArmorId",
                        column: x => x.ArmorId,
                        principalTable: "Armor",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ArmorInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FlawInfo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatureId = table.Column<int>(nullable: true),
                    FlawId = table.Column<int>(nullable: false),
                    Notes = table.Column<string>(nullable: true),
                    RaceId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlawInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlawInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FlawInfo_Flaws_FlawId",
                        column: x => x.FlawId,
                        principalTable: "Flaws",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FlawInfo_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemInfo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatureId = table.Column<int>(nullable: true),
                    ItemId = table.Column<int>(nullable: false),
                    Notes = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemInfo_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OathInfo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    Broken = table.Column<bool>(nullable: false),
                    CreatureId = table.Column<int>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    OathId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OathInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OathInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OathInfo_Oaths_OathId",
                        column: x => x.OathId,
                        principalTable: "Oaths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Skill",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    BelongsTo = table.Column<int>(nullable: false),
                    CreatureId = table.Column<int>(nullable: true),
                    HasDefense = table.Column<bool>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Ranks = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skill", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Skill_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SpellInfo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatureId = table.Column<int>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    SpellId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpellInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SpellInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SpellInfo_Spells_SpellId",
                        column: x => x.SpellId,
                        principalTable: "Spells",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StatMod",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatureId = table.Column<int>(nullable: true),
                    FeatureId = table.Column<int>(nullable: true),
                    FlawId = table.Column<int>(nullable: true),
                    Modifier = table.Column<float>(nullable: false),
                    ModifierType = table.Column<int>(nullable: false),
                    OathId = table.Column<int>(nullable: true),
                    Reason = table.Column<string>(nullable: true),
                    Stat = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatMod", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StatMod_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StatMod_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StatMod_Flaws_FlawId",
                        column: x => x.FlawId,
                        principalTable: "Flaws",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StatMod_Oaths_OathId",
                        column: x => x.OathId,
                        principalTable: "Oaths",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WeaponInfo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    CreatureId = table.Column<int>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    WeaponId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WeaponInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WeaponInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WeaponInfo_Weapons_WeaponId",
                        column: x => x.WeaponId,
                        principalTable: "Weapons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FeatureInfo",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGeneratedOnAdd", true),
                    ArmorInfoId = table.Column<int>(nullable: true),
                    CostWhenTaken = table.Column<int>(nullable: false),
                    CreatureId = table.Column<int>(nullable: true),
                    EnergySacrificedWhenTaken = table.Column<int>(nullable: false),
                    FeatureId = table.Column<int>(nullable: false),
                    ItemInfoId = table.Column<int>(nullable: true),
                    Notes = table.Column<string>(nullable: true),
                    RaceId = table.Column<int>(nullable: true),
                    SpellInfoId = table.Column<int>(nullable: true),
                    TakenAtLevel = table.Column<int>(nullable: false),
                    WeaponInfoId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureInfo", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_ArmorInfo_ArmorInfoId",
                        column: x => x.ArmorInfoId,
                        principalTable: "ArmorInfo",
                        principalColumn: "ArmorInfoId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_Creatures_CreatureId",
                        column: x => x.CreatureId,
                        principalTable: "Creatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_ItemInfo_ItemInfoId",
                        column: x => x.ItemInfoId,
                        principalTable: "ItemInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_Races_RaceId",
                        column: x => x.RaceId,
                        principalTable: "Races",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_SpellInfo_SpellInfoId",
                        column: x => x.SpellInfoId,
                        principalTable: "SpellInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FeatureInfo_WeaponInfo_WeaponInfoId",
                        column: x => x.WeaponInfoId,
                        principalTable: "WeaponInfo",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Armor_PlayerId",
                table: "Armor",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_ArmorInfo_ArmorId",
                table: "ArmorInfo",
                column: "ArmorId");

            migrationBuilder.CreateIndex(
                name: "IX_ArmorInfo_CreatureId",
                table: "ArmorInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Creatures_AuthorId",
                table: "Creatures",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Creatures_RaceId",
                table: "Creatures",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Enchantment_ArmorId",
                table: "Enchantment",
                column: "ArmorId");

            migrationBuilder.CreateIndex(
                name: "IX_Enchantment_BaseSpellId",
                table: "Enchantment",
                column: "BaseSpellId");

            migrationBuilder.CreateIndex(
                name: "IX_Enchantment_ItemId",
                table: "Enchantment",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Enchantment_WeaponId",
                table: "Enchantment",
                column: "WeaponId");

            migrationBuilder.CreateIndex(
                name: "IX_Features_PlayerId",
                table: "Features",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_ArmorInfoId",
                table: "FeatureInfo",
                column: "ArmorInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_CreatureId",
                table: "FeatureInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_FeatureId",
                table: "FeatureInfo",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_ItemInfoId",
                table: "FeatureInfo",
                column: "ItemInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_RaceId",
                table: "FeatureInfo",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_SpellInfoId",
                table: "FeatureInfo",
                column: "SpellInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureInfo_WeaponInfoId",
                table: "FeatureInfo",
                column: "WeaponInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_Flaws_FeatureId",
                table: "Flaws",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Flaws_PlayerId",
                table: "Flaws",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_FlawInfo_CreatureId",
                table: "FlawInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_FlawInfo_FlawId",
                table: "FlawInfo",
                column: "FlawId");

            migrationBuilder.CreateIndex(
                name: "IX_FlawInfo_RaceId",
                table: "FlawInfo",
                column: "RaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_PlayerId",
                table: "Items",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemInfo_CreatureId",
                table: "ItemInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemInfo_ItemId",
                table: "ItemInfo",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Oaths_FeatureId",
                table: "Oaths",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Oaths_PlayerId",
                table: "Oaths",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_OathInfo_CreatureId",
                table: "OathInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_OathInfo_OathId",
                table: "OathInfo",
                column: "OathId");

            migrationBuilder.CreateIndex(
                name: "IX_Races_AuthorId",
                table: "Races",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Skill_CreatureId",
                table: "Skill",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Spells_PlayerId",
                table: "Spells",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_SpellInfo_CreatureId",
                table: "SpellInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_SpellInfo_SpellId",
                table: "SpellInfo",
                column: "SpellId");

            migrationBuilder.CreateIndex(
                name: "IX_StatMod_CreatureId",
                table: "StatMod",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_StatMod_FeatureId",
                table: "StatMod",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_StatMod_FlawId",
                table: "StatMod",
                column: "FlawId");

            migrationBuilder.CreateIndex(
                name: "IX_StatMod_OathId",
                table: "StatMod",
                column: "OathId");

            migrationBuilder.CreateIndex(
                name: "IX_Weapons_PlayerId",
                table: "Weapons",
                column: "PlayerId");

            migrationBuilder.CreateIndex(
                name: "IX_WeaponInfo_CreatureId",
                table: "WeaponInfo",
                column: "CreatureId");

            migrationBuilder.CreateIndex(
                name: "IX_WeaponInfo_WeaponId",
                table: "WeaponInfo",
                column: "WeaponId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SeedInformation");

            migrationBuilder.DropTable(
                name: "Enchantment");

            migrationBuilder.DropTable(
                name: "FeatureInfo");

            migrationBuilder.DropTable(
                name: "FlawInfo");

            migrationBuilder.DropTable(
                name: "OathInfo");

            migrationBuilder.DropTable(
                name: "Skill");

            migrationBuilder.DropTable(
                name: "StatMod");

            migrationBuilder.DropTable(
                name: "ArmorInfo");

            migrationBuilder.DropTable(
                name: "ItemInfo");

            migrationBuilder.DropTable(
                name: "SpellInfo");

            migrationBuilder.DropTable(
                name: "WeaponInfo");

            migrationBuilder.DropTable(
                name: "Flaws");

            migrationBuilder.DropTable(
                name: "Oaths");

            migrationBuilder.DropTable(
                name: "Armor");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Spells");

            migrationBuilder.DropTable(
                name: "Creatures");

            migrationBuilder.DropTable(
                name: "Weapons");

            migrationBuilder.DropTable(
                name: "Features");

            migrationBuilder.DropTable(
                name: "Races");

            migrationBuilder.DropTable(
                name: "Players");
        }
    }
}
