using DatingAppApi.Entities;
using JsonNet.PrivateSettersContractResolvers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;


namespace DatingAppApi.Data
{
    public static class Seed
    {
        //    public static async Task SeedUsers(DataContext dataContext)
        //    {
        //   // if (await dataContext.AppUsers.AnyAsync()) return;

        //    var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
        //    var users = JsonSerializer.Deserialize <List<AppUser>> (userData);
        //    foreach(var user in users)
        //    {
        //        using var hmac = new HMACSHA512();
        //        user.UserName = user.UserName.ToString();
        //        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Password"));
        //        user.PasswordSalt = hmac.Key;
        //        dataContext.AppUsers.Add(user);
        //    }
        //    await dataContext.SaveChangesAsync();
        //}

            public static void Seedit(string jsonData,
                            IServiceProvider serviceProvider)
        {
            JsonSerializerSettings settings = new JsonSerializerSettings
            {
                ContractResolver = new PrivateSetterContractResolver()
            };
            List<AppUser> events =
             JsonConvert.DeserializeObject<List<AppUser>>(
               jsonData, settings);
                foreach (var user in events)
                {
                    using var hmac = new HMACSHA512();
                    user.UserName = user.UserName.ToString();
                    user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Password"));
                    user.PasswordSalt = hmac.Key;
                    
                }
            using ( var serviceScope = serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var context = serviceScope
                              .ServiceProvider.GetService<DataContext>();
                if (!context.AppUsers.Any())
                {
                    context.AddRange(events);
                    context.SaveChanges();
                }
            }
        }
    }
}
