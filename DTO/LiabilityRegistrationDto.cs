namespace FinSys.DTO
{
    public class LiabilityRegistrationDto
    {
        public  string? Name { get; set; }

        public  DateTime Due { get; set; }

        public  string? Type { get; set; }

        public  int Debt { get; set; }

        public  string? Status { get; set; }
    }
}