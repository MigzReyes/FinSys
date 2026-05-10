namespace FinSys.Models
{
    public class Investors
    {
        public int Id { get; set; }

        public required int CompanyId { get; set; }

        public required string StakeholderId{ get; set; }

        public required string FirstName { get; set; }

        public required string MiddleName { get; set; }

        public required string LastName { get; set; }

        public required string Stakeholder { get; set; }

        public required decimal Ownership { get; set; }

        public required int Investment { get; set; }

        public required int Income { get; set; }

        public required decimal Roi { get; set; }

        public required string Email { get; set; }

        public required string Phone { get; set; }

        public required string Address { get; set; }

        public required int Tin { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}