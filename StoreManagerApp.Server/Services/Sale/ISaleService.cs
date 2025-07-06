using StoreManagerApp.Server.Dtos;

namespace StoreManagerApp.Server.Services
{
    public interface ISaleService
    {
        Task<IEnumerable<SaleDto>> GetAllAsync();
        Task<SaleDto> CreateAsync(CreateSaleDto dto);
        Task<SaleDto> UpdateAsync(int id, SaleDto dto);
        Task<bool> DeleteAsync(int id);
    }
}