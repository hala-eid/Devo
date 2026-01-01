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
    [Route("api/mylist")]
    [AllowAnonymous] // Allows requests without a token
    public class MyListController : ControllerBase
    {
        private readonly DevoDbContext _context;
        // Since we aren't using tokens, we define a default ID to assign tasks to.
        private const int DEFAULT_USER_ID = 1;

        public MyListController(DevoDbContext context)
        {
            _context = context;
        }

        // GET: /api/mylist
        [HttpGet]
        public async Task<IActionResult> GetMyList()
        {
            // REMOVED: User.FindFirstValue (which causes 401/errors when null)
            var tasks = await _context.MyListTasks
                                      .Where(t => t.UserId == DEFAULT_USER_ID) // Load for default user
                                      .OrderByDescending(t => t.CreatedAt)
                                      .ToListAsync();
            return Ok(tasks);
        }

        // POST: /api/mylist
        [HttpPost]
        public async Task<IActionResult> CreateMyListTask([FromBody] CreateMyListTaskDto dto)
        {
            // REMOVED: The manual "if (userIdClaim == null) return Unauthorized()" check
            var task = new MyListTask
            {
                Title = dto.Title,
                Description = dto.Description,
                Priority = dto.Priority,
                UserId = DEFAULT_USER_ID, // Use fixed ID
                CreatedAt = DateTime.UtcNow
            };

            _context.MyListTasks.Add(task);
            await _context.SaveChangesAsync();

            _context.TaskHistories.Add(new TaskHistory
            {
                MyListTaskId = task.MyListTaskId,
                Action = "CREATED_MYLIST_TASK",
                PerformedBy = DEFAULT_USER_ID,
                Timestamp = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        // PUT: /api/mylist/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMyListTask(int id, [FromBody] CreateMyListTaskDto dto)
        {
            var task = await _context.MyListTasks.FindAsync(id);
            if (task == null) return NotFound();

            if (!string.IsNullOrEmpty(dto.Title)) task.Title = dto.Title;
            if (dto.Description != null) task.Description = dto.Description;
            if (!string.IsNullOrEmpty(dto.Priority)) task.Priority = dto.Priority;
            if (dto.IsCompleted.HasValue) task.IsCompleted = dto.IsCompleted.Value;

            _context.TaskHistories.Add(new TaskHistory
            {
                MyListTaskId = task.MyListTaskId,
                Action = "UPDATED_MYLIST_TASK",
                PerformedBy = DEFAULT_USER_ID,
                Timestamp = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();

            return Ok(task);
        }

        // DELETE: /api/mylist/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMyListTask(int id)
        {
            var task = await _context.MyListTasks.FindAsync(id);
            if (task == null) return NotFound();

            _context.TaskHistories.Add(new TaskHistory
            {
                MyListTaskId = task.MyListTaskId,
                Action = "DELETED_MYLIST_TASK",
                PerformedBy = DEFAULT_USER_ID,
                Timestamp = DateTime.UtcNow
            });

            _context.MyListTasks.Remove(task);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Task deleted successfully" });
        }
    }
}