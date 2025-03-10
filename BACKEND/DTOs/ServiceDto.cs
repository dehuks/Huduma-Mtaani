namespace BACKEND.DTOs
{
    public class ServiceDto
    {
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
    }

    public class PaymentDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
    }

    public class RatingDto
    {
        public int CustomerId { get; set; }
        public int Rate { get; set; }
    }
}