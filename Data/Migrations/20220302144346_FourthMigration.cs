using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class FourthMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "AppUser",
                schema: "DatingDB",
                newName: "AppUser");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "DatingDB");

            migrationBuilder.RenameTable(
                name: "AppUser",
                newName: "AppUser",
                newSchema: "DatingDB");
        }
    }
}
