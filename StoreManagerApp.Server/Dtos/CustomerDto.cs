namespace StoreManagerApp.Server.Dtos
{
    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
    }

    public class CreateCustomerDto
    {
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
    }
}
