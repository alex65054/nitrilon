using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Campaign
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        [JsonIgnore]
        public ICollection<Member>? Members { get; set; }
    }
}
