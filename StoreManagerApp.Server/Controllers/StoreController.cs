using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Dtos;
using StoreManagerApp.Server.Models;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StoreController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StoreController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetAll()
        {
            try
            {
                var stores = await _context.Stores
                    .Select(s => new StoreDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Address = s.Address
                    }).ToListAsync();

                return Ok(stores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to load stores", error = ex.Message });
            }
        }

        // POST: api/store
        [HttpPost]
        public async Task<ActionResult<StoreDto>> Create([FromBody] CreateStoreDto dto)
        {
            try
            {
                var store = new Store
                {
                    Name = dto.Name,
                    Address = dto.Address
                };

                _context.Stores.Add(store);
                await _context.SaveChangesAsync();

                var result = new StoreDto
                {
                    Id = store.Id,
                    Name = store.Name,
                    Address = store.Address
                };

                return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create store", error = ex.Message });
            }
        }

        // PUT: api/store/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StoreDto dto)
        {
            try
            {
                if (id != dto.Id) return BadRequest("ID mismatch");

                var store = await _context.Stores.FindAsync(id);
                if (store == null) return NotFound();

                store.Name = dto.Name;
                store.Address = dto.Address;

                await _context.SaveChangesAsync();

                return Ok(new StoreDto
                {
                    Id = store.Id,
                    Name = store.Name,
                    Address = store.Address
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update store", error = ex.Message });
            }
        }

        // DELETE: api/store/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var store = await _context.Stores.FindAsync(id);
                if (store == null) return NotFound();

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete store", error = ex.Message });
            }
        }
    }
}
