namespace FinSys.DTO
{
    public class LiabilityPickerDto
    {
        public string? Selected { get; set; }

        public int PageNumber { get; set; } = 1;

        public int PageSize { get; set; } = 5;
    }
}