namespace FinSys.DTO
{
    public class LiabilityRegistrationDto
    {
        public required string Name { get; set; }
        
        public required DateTime Due { get; set; }

        public required string Type { get; set; }

        public required int Debt { get; set; }

        public required int Balance { get; set; }

        public required string Status { get; set; }
    }
}