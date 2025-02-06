using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Entities
{
    public class EventRating
    {
        public int Id { get; set; }
        [JsonIgnore]
        public Event Event { get; set; }
        public int EventId { get; set; }
        public byte Rating { get; set; }
        public DateTime Time { get; set; }
    }
}
