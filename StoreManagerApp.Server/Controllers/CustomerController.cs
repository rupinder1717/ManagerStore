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
        {
            try
            {
                var customers = await _ctx.Customers.ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving customers.", error = ex.Message });
            }
        }

        // GET: api/customer/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> Get(int id)
        {
            try
            {
                var customer = await _ctx.Customers.FindAsync(id);
                return customer == null ? NotFound() : Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve customer.", error = ex.Message });
            }
        }

        // POST: api/customer
        [HttpPost]
        public async Task<ActionResult<Customer>> Create(Customer customer)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                _ctx.Customers.Add(customer);
                await _ctx.SaveChangesAsync();

                return CreatedAtAction(nameof(Get), new { id = customer.Id }, customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create customer.", error = ex.Message });
            }
        }

        // PUT: api/customer/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer updated)
        {
            try
            {
                if (!ModelState.IsValid || id != updated.Id)
                    return BadRequest();

                var customer = await _ctx.Customers.FindAsync(id);
                if (customer == null)
                    return NotFound();

                customer.Name = updated.Name;
                customer.Address = updated.Address;

                await _ctx.SaveChangesAsync();
                return Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update customer.", error = ex.Message });
            }
        }

        // DELETE: api/customer/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var customer = await _ctx.Customers.FindAsync(id);
                if (customer == null)
                    return NotFound();

                _ctx.Customers.Remove(customer);
                await _ctx.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete customer.", error = ex.Message });
            }
        }
    }
}
