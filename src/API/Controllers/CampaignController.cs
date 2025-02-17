using API.Data;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampaignController : ControllerBase
    {
        private readonly DataContext _context;

        public CampaignController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<Campaign>>> GetAllCampaigns()
        {
            var Campaigns = await _context.Campaigns.ToListAsync();

            return Ok(Campaigns);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Campaign>> GetCampaign(int id)
        {
            var Campaign = await _context.Campaigns.FindAsync(id);

            if (Campaign == null) return BadRequest("No such campaign.");

            return Ok(Campaign);
        }

        [HttpGet("AvailableCampaignsFor/{id}")]
        public async Task<ActionResult<List<Campaign>>> GetAllCampaignsAvailableToMember(int id)
        {
            var Member = await _context.Members.FindAsync(id);

            if (Member == null) return BadRequest("No such member.");

            var Campaigns = await _context.Campaigns.Except(Member.Campaigns).ToListAsync();

            return Ok(Campaigns);
        }

        [HttpGet("ExistingCampaignsFor/{id}")]
        public async Task<ActionResult<List<Campaign>>> GetAllCampaignsForMember(int id)
        {
            var Member = await _context.Members.FindAsync(id);

            if (Member == null) return BadRequest("No such member.");

            var Campaigns = Member.Campaigns.ToList();

            return Ok(Campaigns);
        }

        [HttpPost]
        public async Task<ActionResult<Campaign>> AddCampaign(CapaignDTO newCampaign)
        {
            var Campaign = new Campaign
            {
                Name = newCampaign.Name,
                Description = newCampaign.Description
            };

            _context.Campaigns.Add(Campaign);
            await _context.SaveChangesAsync();

            return Ok(Campaign);
        }

        [HttpPut]
        public async Task<ActionResult<Campaign>> UpdateCampaign(Campaign updatedCampaign)
        {
            var Campaign = await _context.Campaigns.FindAsync(updatedCampaign.Id);
            if (Campaign == null) return BadRequest("No such campaign.");

            Campaign.Name = updatedCampaign.Name;
            Campaign.Description = updatedCampaign.Description;

            await _context.SaveChangesAsync();

            return Ok(Campaign);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteCampaign(int id)
        {
            var Campaign = await _context.Campaigns.FindAsync(id);
            if (Campaign == null) return BadRequest("No such campaign.");

            _context.Campaigns.Remove(Campaign);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
