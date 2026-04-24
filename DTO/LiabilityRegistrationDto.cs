namespace FinSys.DTO
{
    public class LiabilityRegistrationDto
    {
        public required string Type { get; set; }

        public required int Debt { get; set; }
        
        public required string Status { get; set; }
    }
}