namespace FinSys.DTO
{
    public class CompanyRegistrationDto
    {
        public required string CompanyName { get; set; }

        public required string CompanyIndustry { get; set; }

        public required string CompanyCountry { get; set; }
        
        public int Investment { get; set; }

        public required string Employees { get; set; }
    }
}