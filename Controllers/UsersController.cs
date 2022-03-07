using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;
        public UsersController(DataContext context)
        {
            
            _context = context;
        }

        //[HttpGet]
        //public async Task<ActionResult <IEnumerable<AppUser>>> GetUsers(){
        //    return await _context.appUsers.ToListAsync();
        //}

        [HttpGet]
        public  ActionResult<IEnumerable<AppUser>> GetUsers()
        {
           
           
            var  data= _context.appUsers.ToList();
            return data;
        }
        [HttpGet("{id}")]
        public ActionResult<AppUser> GetUser(int id)
        {
            return _context.appUsers.Find(id);            
        }

        [HttpPost("{id}")]
        public ActionResult<AppUser> UpdateUser(int id)
        {
            //bool val=_context.appUsers.Update(id);

            return Ok();
        }
    }
}
