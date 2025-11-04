namespace BACKEND.DTOs
{
    public class ProviderResponseDto
    {
        public int ServiceProviderId { get; set; }
        public string FullName { get; set; }
        public double AverageRating { get; set; }
        public int TotalRatings { get; set; }
    }
}
