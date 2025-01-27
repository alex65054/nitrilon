using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class EventRating
    {
        public int Id { get; set; }
        public Event Event { get; set; }
        public int EventId { get; set; }
        public byte Rating { get; set; }
        public DateTime Time { get; set; }
    }
}
