using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Elixr.Api.Migrations
{
    public partial class ArmorSpeedPenalty : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enchantment_Spells_BaseSpellId",
                table: "Enchantment");

            migrationBuilder.AlterColumn<int>(
                name: "BaseSpellId",
                table: "Enchantment",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DefenseBonus",
                table: "Armor",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SpeedPenalty",
                table: "Armor",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Enchantment_Spells_BaseSpellId",
                table: "Enchantment",
                column: "BaseSpellId",
                principalTable: "Spells",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enchantment_Spells_BaseSpellId",
                table: "Enchantment");

            migrationBuilder.DropColumn(
                name: "DefenseBonus",
                table: "Armor");

            migrationBuilder.DropColumn(
                name: "SpeedPenalty",
                table: "Armor");

            migrationBuilder.AlterColumn<int>(
                name: "BaseSpellId",
                table: "Enchantment",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Enchantment_Spells_BaseSpellId",
                table: "Enchantment",
                column: "BaseSpellId",
                principalTable: "Spells",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
