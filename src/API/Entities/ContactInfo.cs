namespace API.Entities
{
    public class ContactInfo
    {
        public Member Member { get; set; }
        public int MemberId { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
    }
}
