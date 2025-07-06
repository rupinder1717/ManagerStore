using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Dtos;
using StoreManagerApp.Server.Models;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SaleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SaleController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/sale
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetAll()
        {
            try
            {
                var sales = await _context.Sales
                    .Include(s => s.Product)
                    .Include(s => s.Customer)
                    .Include(s => s.Store)
                    .Select(s => new SaleDto
                    {
                        Id = s.Id,
                        ProductId = s.ProductId,
                        ProductName = s.Product.Name,
                        CustomerId = s.CustomerId,
                        CustomerName = s.Customer.Name,
                        StoreId = s.StoreId,
                        StoreName = s.Store.Name,
                        Date = s.Date,
                        Quantity = s.Quantity
                    })
                    .ToListAsync();

                return Ok(sales);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to load sales", error = ex.Message });
            }
        }

        // POST: api/sale
        [HttpPost]
        public async Task<ActionResult<SaleDto>> Create([FromBody] CreateSaleDto dto)
        {
            try
            {
                var sale = new Sale
                {
                    ProductId = dto.ProductId,
                    CustomerId = dto.CustomerId,
                    StoreId = dto.StoreId,
                    Date = dto.Date,
                    Quantity = dto.Quantity
                };

                _context.Sales.Add(sale);
                await _context.SaveChangesAsync();

                var createdSale = await _context.Sales
                    .Include(s => s.Product)
                    .Include(s => s.Customer)
                    .Include(s => s.Store)
                    .FirstOrDefaultAsync(s => s.Id == sale.Id);

                if (createdSale == null) return NotFound();

                var result = new SaleDto
                {
                    Id = createdSale.Id,
                    ProductId = createdSale.ProductId,
                    ProductName = createdSale.Product.Name,
                    CustomerId = createdSale.CustomerId,
                    CustomerName = createdSale.Customer.Name,
                    StoreId = createdSale.StoreId,
                    StoreName = createdSale.Store.Name,
                    Date = createdSale.Date,
                    Quantity = createdSale.Quantity
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create sale", error = ex.Message });
            }
        }

        // PUT: api/sale/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateSaleDto dto)
        {
            try
            {
                var sale = await _context.Sales.FindAsync(id);
                if (sale == null) return NotFound();

                sale.ProductId = dto.ProductId;
                sale.CustomerId = dto.CustomerId;
                sale.StoreId = dto.StoreId;
                sale.Date = dto.Date;
                sale.Quantity = dto.Quantity;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Sale updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update sale", error = ex.Message });
            }
        }

        // DELETE: api/sale/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var sale = await _context.Sales.FindAsync(id);
                if (sale == null) return NotFound();

                _context.Sales.Remove(sale);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete sale", error = ex.Message });
            }
        }
    }
}
