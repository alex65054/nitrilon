using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<List<Event>>> GetAllEvents()
        {
            List<Event> events = new List<Event>
            {
                new Event
                {
                    Id = 1,
                    Name = "Test",
                    Description = "Testing",
                    Location = "Testville",
                    Time = DateTime.Now
                }
            };

            return Ok(events);
        }
    }
}
