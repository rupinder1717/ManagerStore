using Microsoft.AspNetCore.Mvc;
using StoreManagerApp.Server.Dtos;
using StoreManagerApp.Server.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace StoreManagerApp.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll()
        {
            try
            {
                var customers = await _customerService.GetAllCustomersAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving customers.", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CustomerDto>> Get(int id)
        {
            try
            {
                var customer = await _customerService.GetCustomerByIdAsync(id);
                return customer == null ? NotFound() : Ok(customer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve customer.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdCustomer = await _customerService.CreateCustomerAsync(dto);
                return CreatedAtAction(nameof(Get), new { id = createdCustomer.Id }, createdCustomer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create customer.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CustomerDto dto)
        {
            try
            {
                if (!ModelState.IsValid || id != dto.Id)
                    return BadRequest();

                var updatedCustomer = await _customerService.UpdateCustomerAsync(id, dto);
                if (updatedCustomer == null)
                    return NotFound();

                return Ok(updatedCustomer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update customer.", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _customerService.DeleteCustomerAsync(id);
                if (!deleted)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete customer.", error = ex.Message });
            }
        }
    }
}
