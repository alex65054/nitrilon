using API.Data;
using API.Entities;
using API.Entities.DTO;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly DataContext _context;

        public MemberController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null) return BadRequest("No such member.");

            return Ok(member);
        }

        [HttpGet("limit/{limit}")]
        public async Task<ActionResult<List<Member>>> GetAllMembersWithLimit(int limit)
        {
            var members = await _context.Members.Take(limit).ToListAsync();

            return Ok(members);
        }

        [HttpGet("limit/{limit}/{search}")]
        public async Task<ActionResult<List<Member>>> GetFilteredMembersWithLimit(string search, int limit)
        {
            search = search.ToLower();
            var members = await _context.Members.Where(e =>
            e.FirstName.ToLower().Contains(search) ||
            e.LastName.ToString().Contains(search) ||
            e.ContactInfo.PhoneNumber.Contains(search) ||
            e.ContactInfo.Email.Contains(search)
            ).Take(limit).ToListAsync();

            return Ok(members);
        }

        [HttpPost]
        public async Task<ActionResult<Member>> AddMember(MemberDTO newMember)
        {
            var member = new Member
            {
                FirstName = newMember.FirstName,
                LastName = newMember.LastName,
                DateJoined = newMember.DateJoined,
                MembershipTypeId = newMember.MembershipTypeId
            };

            _context.Members.Add(member);
            await _context.SaveChangesAsync();

            return Ok(member);
        }

        [HttpPut]
        public async Task<ActionResult<Member>> UpdateMember(Member updatedMember)
        {
            var member = await _context.Members.FindAsync(updatedMember.Id);
            if (member == null) return BadRequest("No such member.");

            member.FirstName = updatedMember.FirstName;
            member.LastName = updatedMember.LastName;
            member.DateJoined = updatedMember.DateJoined;
            member.MembershipTypeId = updatedMember.MembershipTypeId;

            _context.Members.Update(member);
            await _context.SaveChangesAsync();

            return Ok(member);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.Members.FindAsync(id);
            if (member == null) return BadRequest("No such member.");

            _context.Members.Remove(member);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
