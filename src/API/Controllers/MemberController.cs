using API.Data;
using API.Entities;
using API.Entities.DTO;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public async Task<ActionResult<Member>> AddMember(MemberDTO newMember)
        {
            var member = new Member
            {
                FirstName = newMember.FirstName,
                LastName = newMember.LastName
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
