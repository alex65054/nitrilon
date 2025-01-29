namespace API.Entities
{
    public class Member
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime dateJoined { get; set; }
        public ContactInfo ContactInfo { get; set; }
        public MembershipType MembershipType { get; set; }
        public int MembershipTypeId { get; set; }

    }
}
