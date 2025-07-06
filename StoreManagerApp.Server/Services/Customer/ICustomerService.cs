using StoreManagerApp.Server.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreManagerApp.Server.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto);
        Task<CustomerDto?> UpdateCustomerAsync(int id, CustomerDto dto);
        Task<bool> DeleteCustomerAsync(int id);
    }
}
