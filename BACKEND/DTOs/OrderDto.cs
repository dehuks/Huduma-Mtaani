namespace BACKEND.DTOs
{
    public class OrderDto
    {
        public int CustomerId { get; set; }
        public int? ServiceProviderId { get; set; }
        public decimal Amount { get; set; }
    }
     public class UpdateOrderStatusDto
    {
        public string Status { get; set; }
    }
    

    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
