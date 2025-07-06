using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StoreManagerApp.Server.Data;
using StoreManagerApp.Server.Models;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _ctx;
        public CustomerController(AppDbContext ctx) => _ctx = ctx;

        // GET: api/customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAll()
            => Ok(await _ctx.Customers.ToListAsync());

        // GET: api/customer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            var c = await _ctx.Customers.FindAsync(id);
            return c == null ? NotFound() : Ok(c);
        }

        // POST: api/customer
        [HttpPost]
        public async Task<ActionResult<Customer>> Create(Customer customer)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _ctx.Customers.Add(customer);
            await _ctx.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = customer.Id }, customer);
        }

        // PUT: api/customer/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer updated)
        {
            if (!ModelState.IsValid || id != updated.Id) return BadRequest();

            var c = await _ctx.Customers.FindAsync(id);
            if (c == null) return NotFound();

            c.Name = updated.Name;
            c.Address = updated.Address;
           

            await _ctx.SaveChangesAsync();
            return Ok(c);                    // RETURN the updated object!
        }

        // DELETE: api/customer/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _ctx.Customers.FindAsync(id);
            if (c == null) return NotFound();
            _ctx.Customers.Remove(c);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}
