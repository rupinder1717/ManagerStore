namespace StoreManagerApp.Server.Dtos
{
    public class StoreDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
    }

    public class CreateStoreDto
    {
        public string Name { get; set; } = null!;
        public string Address { get; set; } = null!;
    }
}
