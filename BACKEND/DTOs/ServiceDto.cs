namespace BACKEND.DTOs
{
    public class ServiceDto
    {
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
    }

    public class ServiceProviderDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int ServiceId { get; set; }
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