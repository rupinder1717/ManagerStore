namespace StoreManagerApp.Server.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = null!;
        public decimal Price { get; set; }
    }
}
