namespace FinSys.Models
{
    public class Assets
    {
        public int Id { get; set; }

        public required int CompanyId { get; set; }

        public required int AssetId { get; set; }

        public required string Item { get; set; }

        public required string Category { get; set; }

        public required int Amount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}