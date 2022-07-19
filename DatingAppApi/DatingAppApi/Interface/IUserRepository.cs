using DatingAppApi.DTOs;
using DatingAppApi.Entities;
using DatingAppApi.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppApi.Interface
{
    public interface IUserRepository
    {
        public void Update(AppUser user);
        public Task<bool> SaveAllAsync();
        public Task<IEnumerable<AppUser>> GetUsersAync();
        public Task<AppUser> GetUserByIdAsync(int id);
        public Task<AppUser> GetUserByUsernameAsync(string username);
        public Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        public Task<MemberDto> GetMemberAsync(string username);

    }
}
