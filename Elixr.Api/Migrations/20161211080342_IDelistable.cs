using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Elixr.Api.Migrations
{
    public partial class IDelistable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delist",
                table: "Creatures");

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Weapons",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Spells",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Oaths",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Items",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Flaws",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Features",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Creatures",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Delisted",
                table: "Armor",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Weapons");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Spells");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Oaths");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Flaws");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Features");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Creatures");

            migrationBuilder.DropColumn(
                name: "Delisted",
                table: "Armor");

            migrationBuilder.AddColumn<bool>(
                name: "Delist",
                table: "Creatures",
                nullable: false,
                defaultValue: false);
        }
    }
}
