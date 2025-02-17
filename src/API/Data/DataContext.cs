using API.Entities;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Event>().HasKey(e => e.Id);
            modelBuilder.Entity<EventRating>().HasKey(e => e.Id);
            modelBuilder.Entity<Member>().HasKey(e => e.Id);
            modelBuilder.Entity<ContactInfo>().HasKey(e => e.MemberId);
            modelBuilder.Entity<MembershipType>().HasKey(e => e.Id);

            modelBuilder.Entity<EventRating>()
                .HasOne(e => e.Event)
                .WithMany(e => e.EventRatings)
                .HasForeignKey(e => e.EventId);

            modelBuilder.Entity<ContactInfo>()
                .HasOne(e => e.Member)
                .WithOne(e => e.ContactInfo)
                .HasForeignKey<ContactInfo>(e => e.MemberId);

            modelBuilder.Entity<Campaign>()
                .HasMany(e => e.Members)
                .WithMany(e => e.Campaigns);
        }

        public DbSet<Event> Events { get; set; }
        public DbSet<EventRating> EventRatings { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<ContactInfo> ContactInfos { get; set; }
        public DbSet<MembershipType> MembershipTypes { get; set; }
        public DbSet<Campaign> Campaigns { get; set; }
    }
}
