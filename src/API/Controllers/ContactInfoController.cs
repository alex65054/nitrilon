using API.Data;
using API.Entities.DTO;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactInfoController : ControllerBase
    {
        private readonly DataContext _context;

        public ContactInfoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ContactInfo>> GetContactInfo(int id)
        {
            var contactInfo = await _context.ContactInfos.FindAsync(id);
            if (contactInfo == null) return BadRequest("No such contact info.");

            return Ok(contactInfo);
        }

        [HttpPost]
        public async Task<ActionResult<ContactInfo>> AddContactInfo(ContactInfo contactInfo)
        {
            _context.ContactInfos.Add(contactInfo);
            await _context.SaveChangesAsync();

            return Ok(contactInfo);
        }

        [HttpPut]
        public async Task<ActionResult<ContactInfo>> UpdateContactInfo(ContactInfo updatedContactInfo)
        {
            var contactInfo = await _context.ContactInfos.FindAsync(updatedContactInfo.MemberId);
            if (contactInfo == null) return BadRequest("No such contact info.");

            contactInfo.Email = updatedContactInfo.Email;
            contactInfo.PhoneNumber = updatedContactInfo.PhoneNumber;

            _context.ContactInfos.Update(contactInfo);
            await _context.SaveChangesAsync();

            return Ok(contactInfo);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteContactInfo(int id)
        {
            var contactInfo = await _context.ContactInfos.FindAsync(id);
            if (contactInfo == null) return BadRequest("No such contact info.");

            _context.ContactInfos.Remove(contactInfo);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
