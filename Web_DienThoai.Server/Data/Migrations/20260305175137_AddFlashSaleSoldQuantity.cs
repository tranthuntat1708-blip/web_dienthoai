using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Web_NoiThat.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFlashSaleSoldQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SoldQuantity",
                table: "FlashSaleItems",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoldQuantity",
                table: "FlashSaleItems");
        }
    }
}
