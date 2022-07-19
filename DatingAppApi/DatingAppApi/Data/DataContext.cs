using DatingAppApi.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAppApi.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<AppUser>();
            modelBuilder.Entity<UserLike>().HasKey(k=> new {k.SourceUserId, k.LikedUserId });

            modelBuilder.Entity<UserLike>().HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers).HasForeignKey(s=>s.SourceUserId)
            .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<UserLike>().HasOne(s => s.LikedUser)
           .WithMany(l => l.LikedByUsers).HasForeignKey(s => s.LikedUserId)
           .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Message>().HasOne(u => u.Recipient)
           .WithMany(m => m.MessagesReceived)
           .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>().HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);
        }

        public virtual DbSet<AppUser> AppUsers { get; set; }
        public virtual DbSet<UserLike> Likes { get; set; }

        public virtual DbSet<Message> Messages { get; set; }

        
    }
}
