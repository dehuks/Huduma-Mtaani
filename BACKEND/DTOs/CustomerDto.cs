namespace BACKEND.DTOs
{
    public class CustomerDto
    {
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int? AddressId { get; set; }
    }

    public class CustomerResponseDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}
