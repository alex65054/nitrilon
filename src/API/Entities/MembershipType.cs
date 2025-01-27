namespace API.Entities
{
    public class MembershipType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Member> Members { get; set; }
    }
}
