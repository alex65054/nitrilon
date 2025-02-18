using System.Text.Json.Serialization;

namespace API.Entities
{
    public class Campaign
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public string GameMaster { get; set; }

        [JsonIgnore]
        public ICollection<Member>? Participants { get; set; }
    }
}
