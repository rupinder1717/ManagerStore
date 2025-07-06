namespace StoreManagerApp.Server.Dtos
{
    public class SaleDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;

        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;

        public int StoreId { get; set; }
        public string StoreName { get; set; } = string.Empty;

        public DateTime Date { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateSaleDto
    {
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public int StoreId { get; set; }
        public DateTime Date { get; set; }
        public int Quantity { get; set; }
    }
}
