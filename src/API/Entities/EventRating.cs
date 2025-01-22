using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class EventRating
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("Event")]
        public int EventId { get; set; }
        public byte Rating { get; set; }
        public DateTime Time { get; set; }
    }
}
