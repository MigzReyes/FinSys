namespace FinSys.Models
{
    public class Liabilities
    {
        public int Id { get; set; }

        public required int CompanyId { get; set; }

        public required DateTime Due { get; set; }

        public required string Type { get; set; }

        public required int Debt { get; set; }

        public required int Paid { get; set; }

        public required int Balance { get; set; }

        public required decimal Progress { get; set; }

        public required string Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}