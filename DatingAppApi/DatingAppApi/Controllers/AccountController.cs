using AutoMapper;
using DatingAppApi.Data;
using DatingAppApi.Entities;
using DatingAppApi.Interface;
using DatingAppApi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DatingAppApi.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _context;
        private readonly ITokenService _service;
        private readonly IMapper _mapper;
        public AccountController(DataContext context, ITokenService service,IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
            _service = service;
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto register)
        {
            if (await UserExists(register.UserName)) return BadRequest("Username is taken");
            var user = _mapper.Map<AppUser>(register);
            using var hmac = new HMACSHA512();


            user.UserName = register.UserName.ToLower();
            user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password));
            user.PasswordSalt = hmac.Key;
           
            _context.AppUsers.Add(user);
            await _context.SaveChangesAsync();
            var userDto = new UserDto
            {
                UserName = user.UserName,
                Token = _service.CreateToken(user),
                KnownAs=user.KnownAs,
                Gender=user.Gender

            };
            return userDto;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await  _context.AppUsers.Include(p=>p.Photos).FirstOrDefaultAsync(x => x.UserName == loginDto.UserName);
            if (user == null)
            {
                return Unauthorized("Invalid Username");
            }
            using var hmac = new HMACSHA512(user.PasswordSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));
            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash[i])
                    return Unauthorized("Invalid Password");
            }
            var userDto = new UserDto
            {
                UserName = user.UserName,
                Token = _service.CreateToken(user),
                PhotoUrl= user.Photos.FirstOrDefault(x=>x.IsMain)?.Url,
                Gender=user.Gender,
                KnownAs=user.KnownAs
            };
            return userDto;
        }

        private async Task<bool> UserExists(string username)
        {
            return await _context.AppUsers.AnyAsync(x => x.UserName == username.ToLower());
        }

    }

}
