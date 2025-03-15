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

     public class PaymentResponseDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class RatingDto
    {
        public int CustomerId { get; set; }
        public int Rate { get; set; }
    }
}