using devo2.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace DevoBackend.Data
{
    public class DevoDbContext : DbContext
    {
        public DevoDbContext(DbContextOptions<DevoDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<CalendarEvent> CalendarEvents { get; set; }
        public DbSet<EmployeeNote> Notes { get; set; }

        // New
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamMember> TeamMembers { get; set; }
        public DbSet<TeamTask> TeamTasks { get; set; }
        public DbSet<TeamActivity> TeamActivities { get; set; }
        public DbSet<TeamMessage> TeamMessages { get; set; }
        public object ChatMessages { get; internal set; }
        public object ChatMessage { get; internal set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Team>().ToTable("Teams");
            modelBuilder.Entity<TeamMember>().ToTable("TeamMembers");
            modelBuilder.Entity<TeamTask>().ToTable("TeamTasks");
            modelBuilder.Entity<TeamActivity>().ToTable("TeamActivities");
            modelBuilder.Entity<TeamMessage>().ToTable("TeamMessages");

            // simple indexes
            modelBuilder.Entity<TeamMember>().HasIndex(tm => new { tm.TeamId, tm.UserId });
            modelBuilder.Entity<TeamTask>().HasIndex(tt => tt.TeamId);
            modelBuilder.Entity<TeamMessage>().HasIndex(m => m.TeamId);
        }
    }
}

