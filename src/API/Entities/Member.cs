using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Member
    {
        public int Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public DateTime DateJoined { get; set; }
        [JsonIgnore]
        public ContactInfo? ContactInfo { get; set; }
        [JsonIgnore]
        public MembershipType? MembershipType { get; set; }
        [JsonIgnore]
        public ICollection<Campaign>? Campaigns { get; set; }
        public int MembershipTypeId { get; set; }

    }
}
