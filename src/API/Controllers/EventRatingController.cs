using API.Data;
using Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventRatingController : ControllerBase
    {
        private readonly DataContext _context;

        public EventRatingController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("GetAllEventRatings")]
        public async Task<ActionResult<List<EventRating>>> GetAllEventRatings()
        {
            var ratings = await _context.EventRatings.ToListAsync();

            return Ok(ratings);
        }

        [HttpGet("GetEventRating/{id}")]
        public async Task<ActionResult<EventRating>> GetEventRating(int id)
        {
            var rating = await _context.EventRatings.FindAsync(id);
            if (rating == null) return BadRequest("No such event rating.");

            return Ok(rating);
        }

        [HttpGet("GetRatingsFromEvent/{eventId}")]
        public async Task<ActionResult<List<EventRating>>> GetEventRatingsFromEvent(int eventId)
        {
            var ratings = await _context.EventRatings.Where(r => r.EventId == eventId).ToListAsync();

            return Ok(ratings);
        }

        [HttpGet("GetRatingsFromEvent/{eventId}/{ratingValue}")]
        public async Task<ActionResult<List<EventRating>>> GetEventRatingsFromEvent(int eventId, byte ratingValue)
        {
            var ratings = await _context.EventRatings.Where(r => r.EventId == eventId && r.Rating == ratingValue).ToListAsync();

            return Ok(ratings);
        }

        [HttpPost]
        public async Task<ActionResult<EventRating>> AddEventRating(EventRatingDTO rating)
        {
            var newRating = new EventRating
            {
                EventId = rating.EventId,
                Rating = rating.Rating,
                Time = DateTime.Now
            };

            _context.EventRatings.Add(newRating);
            await _context.SaveChangesAsync();

            return Ok(newRating);
        }

        [HttpDelete]
        public async Task<ActionResult<EventRating>> DeleteEventRating(int id)
        {
            var rating = await _context.EventRatings.FindAsync(id);
            if (rating == null) return BadRequest("No such event rating.");

            _context.EventRatings.Remove(rating);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
