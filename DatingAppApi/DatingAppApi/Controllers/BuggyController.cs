using DatingAppApi.Data;
using DatingAppApi.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppApi.Controllers
{
    public class BuggyController : BaseApiController
    {
        public DataContext _context;
        public BuggyController(DataContext dataContext)
        {
            _context = dataContext;
        }
        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "Secret Text";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _context.AppUsers.Find(-1);
            if (thing == null) return NotFound();
            return Ok(thing);
        }
       
        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            var thing = _context.AppUsers.Find(-1);
            var thingToReturn = thing.ToString();
            return thingToReturn;
            
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This was not a good request");
        }

    }
}
