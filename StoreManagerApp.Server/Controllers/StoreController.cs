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
    public class StoreController : ControllerBase
    {
        private readonly IStoreService _storeService;

        public StoreController(IStoreService storeService)
        {
            _storeService = storeService;
        }

        // GET: api/store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetAll()
        {
            try
            {
                var stores = await _storeService.GetAllStoresAsync();
                return Ok(stores);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to load stores", error = ex.Message });
            }
        }

        // GET: api/store/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetById(int id)
        {
            var store = await _storeService.GetStoreByIdAsync(id);
            if (store == null) return NotFound();
            return Ok(store);
        }

        // POST: api/store
        [HttpPost]
        public async Task<ActionResult<StoreDto>> Create([FromBody] CreateStoreDto dto)
        {
            try
            {
                var createdStore = await _storeService.CreateStoreAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = createdStore.Id }, createdStore);
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

                var updatedStore = await _storeService.UpdateStoreAsync(id, dto);
                if (updatedStore == null) return NotFound();

                return Ok(updatedStore);
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
                var deleted = await _storeService.DeleteStoreAsync(id);
                if (!deleted) return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete store", error = ex.Message });
            }
        }
    }
}
