using AutoMapper;
using DatingAppApi.Data;
using DatingAppApi.DTOs;
using DatingAppApi.Entities;
using DatingAppApi.Extensions;
using DatingAppApi.Helpers;
using DatingAppApi.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingAppApi.Controllers
{
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository userRpository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UsersController(IUserRepository repository, IMapper mapper, IPhotoService photoService)
        {
            _photoService = photoService;
            userRpository = repository;
            _mapper = mapper;
        }

        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()
        //{
        //    return await _context.appUsers.ToListAsync();
        //}
        //[AllowAnonymous]
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsersAsync()
        //{
        //    var username = User.GetUserName();
        //    var user = await userRpository.GetUsersAync();

        //    var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(user);
        //    return Ok(userToReturn);

        //}


[HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await userRpository.GetUserByUsernameAsync(User.GetUserName());
            if (user != null)
            {
                userParams.CurrentUsername = user.UserName;
                if (string.IsNullOrEmpty(userParams.Gender))
                {
                    userParams.Gender = user.Gender == "male" ? "female" : "male";
                }
                var users = await userRpository.GetMembersAsync(userParams);

                Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

                return Ok(users);
            }
            var userDetails = await userRpository.GetUsersAync();
            var userToReturn = _mapper.Map<IEnumerable<MemberDto>>(userDetails);
            return Ok(userToReturn);

        }

        [Authorize]
        [HttpGet("{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(string username)
        {
            var usernames = User.GetUserName();
            var user = await userRpository.GetUserByUsernameAsync(username);
            return _mapper.Map<MemberDto>(user);
        }

        [HttpPut]
        public async Task<ActionResult<AppUser>> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUserName();
            var user = await userRpository.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDto, user);
            userRpository.Update(user);
            if (await userRpository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await userRpository.GetUserByUsernameAsync("Tasha");
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId

            };
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if (await userRpository.SaveAllAsync())

                return CreatedAtRoute("GetUser", new { username = user.UserName }, _mapper.Map<PhotoDto>(photo));

            return BadRequest("Problem adding input");

        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await userRpository.GetUserByUsernameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo.IsMain) return BadRequest("This is already your main photo");
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) { currentMain.IsMain = false; }
            photo.IsMain = true;

            if (await userRpository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to set main photo");

        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await userRpository.GetUserByUsernameAsync(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("This is already your main photo");
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                {
                    return BadRequest(result.Error.Message);
                }
            }

            user.Photos.Remove(photo);
            if (await userRpository.SaveAllAsync()) return Ok();
            return BadRequest("Failed to delete photo");

        }
    }
}
