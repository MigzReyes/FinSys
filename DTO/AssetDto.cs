namespace FinSys.DTO
{
    public class AssetDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }

        public string? AssetId { get; set; }

        public string? Item { get; set; }

        public string? Category { get; set; }

        public int Amount { get; set; }
    }
}