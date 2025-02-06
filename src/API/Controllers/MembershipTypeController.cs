using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembershipTypeController : ControllerBase
    {
        private readonly DataContext _context;

        public MembershipTypeController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<MembershipType>>> GetAllMembershipTypes()
        {
            var membershipType = await _context.MembershipTypes.ToListAsync();

            return Ok(membershipType);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MembershipType>> GetMembershipType(int id)
        {
            var membershipType = await _context.MembershipTypes.FindAsync(id);

            if (membershipType == null) return BadRequest("No such membership type.");

            return Ok(membershipType);
        }

        [HttpPost]
        public async Task<ActionResult<MembershipType>> AddMembershipType(MembershipTypeDTO newMembershipType)
        {
            var membershipType = new MembershipType
            {
                Name = newMembershipType.Name
            };

            _context.MembershipTypes.Add(membershipType);
            await _context.SaveChangesAsync();

            return Ok(membershipType);
        }

        [HttpPut]
        public async Task<ActionResult<MembershipType>> UpdateMembershipType(MembershipType updatedMembershipType)
        {
            var membershipType = await _context.MembershipTypes.FindAsync(updatedMembershipType.Id);
            if (membershipType == null) return BadRequest("No such membership type.");

            membershipType.Name = updatedMembershipType.Name;

            await _context.SaveChangesAsync();

            return Ok(membershipType);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMembershipType(int id)
        {
            var membershipType = await _context.MembershipTypes.FindAsync(id);
            if (membershipType == null) return BadRequest("No such membership type.");

            _context.MembershipTypes.Remove(membershipType);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
