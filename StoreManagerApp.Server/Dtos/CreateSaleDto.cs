namespace StoreManagerApp.Server.Dtos
{
    public class CreateSaleDto
    {
        public int ProductId { get; set; }
        public int CustomerId { get; set; }
        public int StoreId { get; set; }
        public DateTime DateSold { get; set; }
    }

}