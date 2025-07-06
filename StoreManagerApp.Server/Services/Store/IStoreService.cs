using StoreManagerApp.Server.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreManagerApp.Server.Services
{
    public interface IStoreService
    {
        Task<IEnumerable<StoreDto>> GetAllStoresAsync();
        Task<StoreDto?> GetStoreByIdAsync(int id);
        Task<StoreDto> CreateStoreAsync(CreateStoreDto dto);
        Task<StoreDto?> UpdateStoreAsync(int id, StoreDto dto);
        Task<bool> DeleteStoreAsync(int id);
    }
}
