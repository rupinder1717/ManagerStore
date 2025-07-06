using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Dtos;
using StoreManagerApp.Server.Models;

namespace StoreManagerApp.Server.Services
{
    public class SaleService : ISaleService
    {
        private readonly AppDbContext _context;

        public SaleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SaleDto>> GetAllAsync()
        {
            var sales = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Customer)
                .Include(s => s.Store)
                .ToListAsync();

            return sales.Select(s => new SaleDto
            {
                Id = s.Id,
                ProductId = s.ProductId,
                ProductName = s.Product?.Name ?? "",
                CustomerId = s.CustomerId,
                CustomerName = s.Customer?.Name ?? "",
                StoreId = s.StoreId,
                StoreName = s.Store?.Name ?? "",
                DateSold = s.DateSold
            });
        }

        public async Task<SaleDto> CreateAsync(CreateSaleDto dto)
        {
            var sale = new Sale
            {
                ProductId = dto.ProductId,
                CustomerId = dto.CustomerId,
                StoreId = dto.StoreId,
                DateSold = dto.DateSold
            };

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            sale = await _context.Sales
                .Include(s => s.Product)
                .Include(s => s.Customer)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.Id == sale.Id);

            return new SaleDto
            {
                Id = sale.Id,
                ProductId = sale.ProductId,
                ProductName = sale.Product?.Name ?? "",
                CustomerId = sale.CustomerId,
                CustomerName = sale.Customer?.Name ?? "",
                StoreId = sale.StoreId,
                StoreName = sale.Store?.Name ?? "",
                DateSold = sale.DateSold
            };
        }

        public async Task<SaleDto> UpdateAsync(int id, SaleDto dto)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null) return null;

            sale.ProductId = dto.ProductId;
            sale.CustomerId = dto.CustomerId;
            sale.StoreId = dto.StoreId;
            sale.DateSold = dto.DateSold;

            await _context.SaveChangesAsync();
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sale = await _context.Sales.FindAsync(id);
            if (sale == null) return false;

            _context.Sales.Remove(sale);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}