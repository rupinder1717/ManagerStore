using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Dtos;
using StoreManagerApp.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StoreManagerApp.Server.Services
{
    public class StoreService : IStoreService
    {
        private readonly AppDbContext _context;

        public StoreService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StoreDto>> GetAllStoresAsync()
        {
            return await _context.Stores
                .Select(s => new StoreDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Address = s.Address
                })
                .ToListAsync();
        }

        public async Task<StoreDto?> GetStoreByIdAsync(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return null;

            return new StoreDto
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };
        }

        public async Task<StoreDto> CreateStoreAsync(CreateStoreDto dto)
        {
            var store = new Store
            {
                Name = dto.Name,
                Address = dto.Address
            };

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            return new StoreDto
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };
        }

        public async Task<StoreDto?> UpdateStoreAsync(int id, StoreDto dto)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return null;

            store.Name = dto.Name;
            store.Address = dto.Address;

            await _context.SaveChangesAsync();

            return new StoreDto
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };
        }

        public async Task<bool> DeleteStoreAsync(int id)
        {
            var store = await _context.Stores.FindAsync(id);
            if (store == null) return false;

            _context.Stores.Remove(store);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
