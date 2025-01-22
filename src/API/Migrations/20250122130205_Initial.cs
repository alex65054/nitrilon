using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_EventRatings_EventId",
                table: "EventRatings",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventRatings_Events_EventId",
                table: "EventRatings",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventRatings_Events_EventId",
                table: "EventRatings");

            migrationBuilder.DropIndex(
                name: "IX_EventRatings_EventId",
                table: "EventRatings");
        }
    }
}
