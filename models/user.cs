using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Devo.models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? JobTitle { get; set; }
       public int? Department{ get; set; }
       public string? PhoneNumber { get; set; }
       public string? Location { get; set; }
        public string Role { get; set; } = "User";    // optional
        public string? ProfilePhoto { get; set; }
        public string ReportsTo { get; set; }
        public string Organization { get; set; }

        // Navigation collections
        public ICollection<AssignedTask> AssignedTasks { get; set; } = new List<AssignedTask>();
        public ICollection<AssignedTask> CreatedTasks { get; set; } = new List<AssignedTask>();
        public ICollection<Meeting> CreatedMeetings { get; set; } = new List<Meeting>();
        public ICollection<HelpArticle> HelpArticles { get; set; } = new List<HelpArticle>();
        public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
    }
    public class ContactMessage
    {
        [Key]
        public int Id { get; set; }
        public string SenderName { get; set; }
        public string SenderEmail { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
        public int ContactMessageId { get; set; }
        public int? UserId { get; set; }
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User? User { get; set; }
    }

    public class HelpArticle
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public User Creator { get; set; } = null!;
    }

    public class MeetingParticipant
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Meeting")]
        public int MeetingId { get; set; }
        public Meeting Meeting { get; set; }
        public int UserId { get; set; }

        [ForeignKey("TeamMember")]
        public int TeamMemberId { get; set; }
        public TeamMember TeamMember { get; set; }
    }

    public class Meeting
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime ScheduledAt { get; set; }
        public string Location { get; set; }
        public string? Description { get; set; }
        public int CreatedBy { get; set; }
        public User Creator { get; set; } = null!;
        public ICollection<MeetingParticipant> Participants { get; set; }
        public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
    }

    public class Note
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }

        [ForeignKey("TeamMember")]
        public int AuthorId { get; set; }
        public TeamMember Author { get; set; }

        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }

    public class Notification
    {
        [Key]
        public int Id { get; set; }
        public string Message { get; set; }

        [ForeignKey("TeamMember")]
        public int RecipientId { get; set; }
        public TeamMember Recipient { get; set; }

        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string? Type { get; set; }


    }

    public class TaskComment
    {
        [Key]
        public int Id { get; set; }
        public string Comment { get; set; }

        [ForeignKey("Task")]
        public int TaskId { get; set; }
        public Task Task { get; set; }

        [ForeignKey("TeamMember")]
        public int AuthorId { get; set; }
        public TeamMember Author { get; set; }

        public DateTime CreatedAt { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = null!;
       // public AssignedTask Task { get; set; } = null!;
        public User User { get; set; } = null!;
    }

    public class TaskHistory
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Task")]
        public int TaskId { get; set; }
        public Task Task { get; set; }

        public string Status { get; set; }
        public DateTime ChangedAt { get; set; }
        public string Action { get; set; } = null!;
        public int PerformedBy { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

       // public AssignedTask Task { get; set; } = null!;
        public User User { get; set; } = null!;
    }

    public class ProjectTask
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        [ForeignKey("TeamMember")]
        public int AssignedToId { get; set; }
        public TeamMember AssignedTo { get; set; }

        public DateTime DueDate { get; set; }
        public string Status { get; set; }

        public ICollection<TaskComment> ? Comments { get; set; }
        public ICollection<TaskHistory>?  History { get; set; }
    }

    public class TeamMember
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        [ForeignKey("Team")]
        public int TeamId { get; set; }
        public Team Team { get; set; }
        public int UserId { get; set; }
        public string? RoleInTeam { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Task> Tasks { get; set; }
        public ICollection<Note> Notes { get; set; }
        public ICollection<Notification> Notifications { get; set; }
    }

    public class Team
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public int CreatedBy { get; set; }

        // Navigation properties
        public User Creator { get; set; } = null!;

        public ICollection<TeamMember> Members { get; set; }
    }

    public class UserActivity
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("TeamMember")]
        public int TeamMemberId { get; set; }
        public TeamMember TeamMember { get; set; }

        public string Action { get; set; }
        public DateTime ActionAt { get; set; }
        public int CreatedBy { get; set; }

        // Navigation properties
        public User Creator { get; set; } = null!;
        public int? RelatedTaskId { get; set; }
        public int? RelatedMeetingId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User User { get; set; } = null!;
        public AssignedTask? Task { get; set; }
        public Meeting? Meeting { get; set; }
    }

    /*public class AssignedTask
    {
        [Key]
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Status { get; set; }

        // Foreign Keys
        public int? AssignedToId{ get; set; }
        public User? Assignee { get; set; }

        public int? CreatedBy { get; set; }
        public User? Creator { get; set; }
        public ICollection<TaskComment>? Comments { get; set; }

        // Navigation Properties
        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
        public ICollection<TaskHistory> Histories { get; set; } = new List<TaskHistory>();
        public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
        public int Id { get; internal set; }
    }
    public class AssignedTask
    {
        public int AssignedTaskId { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public string? Status { get; set; } // Could be enum
        public string? Priority { get; set; } // Could be enum
        public string? Label { get; set; }
        public int? ProjectId { get; set; }
        public int? AssignedTo { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Recurrence { get; set; }

        // Navigation properties
        public User? Assignee { get; set; }
        public User? Creator { get; set; }
        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
        public ICollection<TaskHistory> Histories { get; set; } = new List<TaskHistory>();
        public ICollection<UserActivity> UserActivities { get; set; } = new List<UserActivity>();
    }

    */
}
