namespace API.Entities.DTO
{
    public class MemberDTO
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime dateJoined { get; set; }
        public int MembershipTypeId { get; set; }
    }
}
