using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DevoBackend.Data;
using DevoBackend.Models;
using DevoBackend.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DevoBackend.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [AllowAnonymous] // Allows access without a JWT token
    public class TasksController : ControllerBase
    {
        private readonly DevoDbContext _context;
        private const int DEFAULT_USER_ID = 1; // Default ID for no-auth mode

        public TasksController(DevoDbContext context)
        {
            _context = context;
        }

        // GET: /api/tasks
        [HttpGet]
        public async Task<IActionResult> GetTasks()
        {
            var tasks = await _context.AssignedTasks
              .Where(t => t.CreatedBy == DEFAULT_USER_ID || t.AssignedTo == DEFAULT_USER_ID)
              .Select(t => new
              {
                  id = t.AssignedTaskId,
                  title = t.Title,
                  description = t.Description,
                  tags = t.Tags != null ? t.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries) : new string[0],
                  status = t.Status,
                  assignedBy = _context.Users
                      .Where(u => u.UserId == t.CreatedBy)
                      .Select(u => u.Email)
                      .FirstOrDefault(),
                  assignedTo = _context.Users
                      .Where(u => u.UserId == t.AssignedTo)
                      .Select(u => u.Email)
                      .FirstOrDefault(),
                  createdAt = t.CreatedAt,
                  dueDate = t.DueDate
              })
              .ToListAsync();

            return Ok(tasks);
        }

        // POST: /api/tasks
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            // 1. Get the Creator (Defaulting to ID 1)
            var creator = await _context.Users.FindAsync(DEFAULT_USER_ID);
            if (creator == null) return BadRequest("System User ID 1 not found in database.");

            // 2. Try to find the assignee by email provided from Angular
            var assignee = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.AssignedToEmail);

            // 3. Fallback: If email doesn't exist, assign it to the creator (ID 1)
            if (assignee == null)
            {
                assignee = creator;
            }

            var task = new AssignedTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Tags = dto.Tags != null ? string.Join(",", dto.Tags) : "",
                Status = MapStatusToDb(dto.Status),
                CreatedBy = creator.UserId,
                AssignedTo = assignee.UserId,
                CreatedAt = DateTime.UtcNow,
                DueDate = dto.DueDate
            };

            _context.AssignedTasks.Add(task);
            await _context.SaveChangesAsync();

            // Log History
            _context.TaskHistories.Add(new TaskHistory
            {
                AssignedTaskId = task.AssignedTaskId,
                Action = "CREATED_ASSIGNED_TASK",
                PerformedBy = creator.UserId,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new
            {
                id = task.AssignedTaskId,
                title = task.Title,
                description = task.Description,
                tags = task.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries),
                status = task.Status,
                assignedBy = creator.Email,
                assignedTo = assignee.Email,
                createdAt = task.CreatedAt,
                dueDate = task.DueDate
            });
        }

        // PATCH: /api/tasks/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTaskStatus(int id, [FromBody] UpdateStatusDto dto)
        {
            var task = await _context.AssignedTasks.FindAsync(id);
            if (task == null) return NotFound();

            task.Status = MapStatusToDb(dto.NewStatus);

            _context.TaskHistories.Add(new TaskHistory
            {
                AssignedTaskId = task.AssignedTaskId,
                Action = $"UPDATED_STATUS_TO_{task.Status}",
                PerformedBy = DEFAULT_USER_ID,
                Timestamp = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();

            return Ok(new { id = task.AssignedTaskId, status = task.Status });
        }

        private static string MapStatusToDb(string status)
        {
            return status?.ToLower() switch
            {
                "todo" => "Todo",
                "in-progress" => "InProgress",
                "review" => "Review",
                "done" => "Done",
                _ => "Todo"
            };
        }
    }

    // DTO defined outside the controller class to avoid build errors
    public class UpdateStatusDto
    {
        public string NewStatus { get; set; } = null!;
    }
}