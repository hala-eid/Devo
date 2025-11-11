using Devo.Data;
using Devo.models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Devo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactMessagesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ContactMessagesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.ContactMessages.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) =>
            await _context.ContactMessages.FindAsync(id) is ContactMessage msg ? Ok(msg) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContactMessage msg)
        {
            _context.ContactMessages.Add(msg);
            await _context.SaveChangesAsync();
            return Ok(msg);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ContactMessage updated)
        {
            if (id != updated.Id) return BadRequest();
            var msg = await _context.ContactMessages.FindAsync(id);
            if (msg == null) return NotFound();

            _context.Entry(msg).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(msg);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var msg = await _context.ContactMessages.FindAsync(id);
            if (msg == null) return NotFound();

            _context.ContactMessages.Remove(msg);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class HelpArticlesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public HelpArticlesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.HelpArticles.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) =>
            await _context.HelpArticles.FindAsync(id) is HelpArticle article ? Ok(article) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HelpArticle article)
        {
            _context.HelpArticles.Add(article);
            await _context.SaveChangesAsync();
            return Ok(article);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] HelpArticle updated)
        {
            if (id != updated.Id) return BadRequest();
            var article = await _context.HelpArticles.FindAsync(id);
            if (article == null) return NotFound();

            _context.Entry(article).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(article);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var article = await _context.HelpArticles.FindAsync(id);
            if (article == null) return NotFound();

            _context.HelpArticles.Remove(article);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class MeetingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MeetingsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Meetings.Include(m => m.Participants).ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) =>
            await _context.Meetings.Include(m => m.Participants).FirstOrDefaultAsync(m => m.Id == id)
            is Meeting mObj ? Ok(mObj) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Meeting meeting)
        {
            _context.Meetings.Add(meeting);
            await _context.SaveChangesAsync();
            return Ok(meeting);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Meeting updated)
        {
            if (id != updated.Id) return BadRequest();
            var m = await _context.Meetings.FindAsync(id);
            if (m == null) return NotFound();

            _context.Entry(m).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(m);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var m = await _context.Meetings.FindAsync(id);
            if (m == null) return NotFound();

            _context.Meetings.Remove(m);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class MeetingParticipantsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public MeetingParticipantsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.MeetingParticipants
                .Include(mp => mp.Meeting)
                .Include(mp => mp.TeamMember)
                .ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) =>
            await _context.MeetingParticipants
                .Include(mp => mp.Meeting)
                .Include(mp => mp.TeamMember)
                .FirstOrDefaultAsync(mp => mp.Id == id)
            is MeetingParticipant mpObj ? Ok(mpObj) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] MeetingParticipant mp)
        {
            _context.MeetingParticipants.Add(mp);
            await _context.SaveChangesAsync();
            return Ok(mp);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] MeetingParticipant updated)
        {
            if (id != updated.Id) return BadRequest();
            var mp = await _context.MeetingParticipants.FindAsync(id);
            if (mp == null) return NotFound();

            _context.Entry(mp).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(mp);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var mp = await _context.MeetingParticipants.FindAsync(id);
            if (mp == null) return NotFound();

            _context.MeetingParticipants.Remove(mp);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NotesController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Notes.Include(n => n.Author).ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) =>
            await _context.Notes.Include(n => n.Author).FirstOrDefaultAsync(n => n.Id == id)
            is Note nObj ? Ok(nObj) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Note note)
        {
            _context.Notes.Add(note);
            await _context.SaveChangesAsync();
            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Note updated)
        {
            if (id != updated.Id) return BadRequest();
            var n = await _context.Notes.FindAsync(id);
            if (n == null) return NotFound();

            _context.Entry(n).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(n);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var n = await _context.Notes.FindAsync(id);
            if (n == null) return NotFound();

            _context.Notes.Remove(n);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public NotificationsController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() =>
            Ok(await _context.Notifications.Include(n => n.Recipient).ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id) =>
            await _context.Notifications.Include(n => n.Recipient).FirstOrDefaultAsync(n => n.Id == id)
            is Notification nObj ? Ok(nObj) : NotFound();

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Notification note)
        {
            _context.Notifications.Add(note);
            await _context.SaveChangesAsync();
            return Ok(note);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Notification updated)
        {
            if (id != updated.Id) return BadRequest();
            var n = await _context.Notifications.FindAsync(id);
            if (n == null) return NotFound();

            _context.Entry(n).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(n);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var n = await _context.Notifications.FindAsync(id);
            if (n == null) return NotFound();

            _context.Notifications.Remove(n);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TasksController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tasks = await _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.Comments)
               .Include(t => t.History)
                .ToListAsync();

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var task = await _context.Tasks
                .Include(t => t.AssignedTo)
              .Include(t => t.Comments)
               .Include(t => t.History)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (task == null) return NotFound();
            return Ok(task);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AssignedTask t)
        {
            _context.Tasks.Add(t);
            await _context.SaveChangesAsync();
            return Ok(t);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] AssignedTask updated)
        {
            if (id != updated.Id) return BadRequest();
            var t = await _context.Tasks.FindAsync(id);
            if (t == null) return NotFound();

            _context.Entry(t).CurrentValues.SetValues(updated);
            await _context.SaveChangesAsync();
            return Ok(t);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var t = await _context.Tasks.FindAsync(id);
            if (t == null) return NotFound();

            _context.Tasks.Remove(t);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }
    }
}
