using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Elixr.Api.Migrations
{
    public partial class MakeCreatureVotable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "CreatedAtMS",
                table: "Creatures",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "DownVotes",
                table: "Creatures",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UpVotes",
                table: "Creatures",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAtMS",
                table: "Creatures");

            migrationBuilder.DropColumn(
                name: "DownVotes",
                table: "Creatures");

            migrationBuilder.DropColumn(
                name: "UpVotes",
                table: "Creatures");
        }
    }
}
