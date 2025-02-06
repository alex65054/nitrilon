using System.Text.Json.Serialization;

namespace API.Entities
{
    public class MembershipType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [JsonIgnore]
        public ICollection<Member> Members { get; set; }
    }
}
