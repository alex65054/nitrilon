using API.Data;
using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly DataContext _context;

        public EventController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetAllEvents()
        {
            var events = await _context.Events.ToListAsync();

            return Ok(events);
        }

        [HttpGet("limit/{limit}")]
        public async Task<ActionResult<List<Event>>> GetAllEventsWithLimit(int limit)
        {
            var events = await _context.Events.Take(limit).ToListAsync();

            return Ok(events);
        }

        [HttpGet("limit/{limit}/{search}")]
        public async Task<ActionResult<List<Event>>> GetFilteredEventsWithLimit(string search, int limit)
        {
            search = search.ToLower();
            var events = await _context.Events.Where(e => 
            e.Name.ToLower().Contains(search) || 
            e.Time.ToString().Contains(search) || 
            e.Location.ToLower().Contains(search)
            ).Take(limit).ToListAsync();

            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var singleEvent = await _context.Events.FindAsync(id);

            if (singleEvent == null) return BadRequest("No such event.");

            return Ok(singleEvent);
        }

        [HttpPost]
        public async Task<ActionResult<Event>> AddEvent(EventDTO newEvent)
        {
            var singleEvent = new Event 
            {
                Name = newEvent.Name,
                Description = newEvent.Description,
                Location = newEvent.Location,
                Time = newEvent.Time,
            };

            _context.Events.Add(singleEvent);
            await _context.SaveChangesAsync();

            return Ok(singleEvent);
        }

        [HttpPut]
        public async Task<ActionResult<Event>> UpdateEvent(Event updatedEvent)
        {
            var dbEvent = await _context.Events.FindAsync(updatedEvent.Id);
            if (dbEvent == null) return BadRequest("No such event.");

            dbEvent.Name = updatedEvent.Name;
            dbEvent.Description = updatedEvent.Description;
            dbEvent.Location = updatedEvent.Location;
            dbEvent.Time = updatedEvent.Time;

            await _context.SaveChangesAsync();

            return Ok(updatedEvent);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var dbEvent = await _context.Events.FindAsync(id);
            if (dbEvent == null) return BadRequest("No such event.");

            _context.Events.Remove(dbEvent);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
