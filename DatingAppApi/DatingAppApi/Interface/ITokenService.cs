using DatingAppApi.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppApi.Interface
{
   public interface ITokenService
    {
        public string CreateToken(AppUser appUser);
    }
}
