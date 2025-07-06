using StoreManagerApp.Server.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreManagerApp.Server.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto dto);
        Task<ProductDto?> UpdateProductAsync(int id, ProductDto dto);
        Task<bool> DeleteProductAsync(int id);
    }
}
