using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace devo2.Migrations
{
    /// <inheritdoc />
    public partial class AddNotesToCalendarEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "CalendarEvents",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "CalendarEvents");
        }
    }
}
