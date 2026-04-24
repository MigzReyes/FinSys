namespace FinSys.DTO
{
    public class LiabilityDto
    {
        public int Id { get; set; }

        public int CompanyId { get; set; }

        public string? Name { get; set; }

        public DateTime Due { get; set; }

        public string? Type { get; set; }

        public int Debt { get; set; }

        public int Paid { get; set; }

        public int Balance { get; set; }

        public decimal Progress { get; set; }

        public string? Status { get; set; }

    }
}