import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm:NgForm|undefined;  
  member:Member | undefined;
  user:User ;
  @HostListener('window:beforerunload',['$event']) unloadNotification($event:any){
    $event.returnValue =true;
  }

  constructor( private accountService: AccountService, private memberService:MembersService, private toastrService:ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(
      (user:any)=>{      
        this.user={
          userName: user.userName,
          token:user.token,
          photoUrl:"",
          knownAs:user.knownAs,
          gender:user.gender
          }
      });
      this.member ={
        id:0,
        userName:"",
        photUrl:"",
        age:0,
        knownAs:"",
        created:new Date(),
        lastActive:new Date(),
        gender:"",
        introduction:'',
        lookingFor:"",
        intrests:"",
        city:"",
        country:"",
        photoUrl:"",
        photos:[]
      };
      this.loadMemeber();
   }

  ngOnInit(): void {
   
  }

  loadMemeber(){
    this.memberService.getMember(this.user?.userName ?? '').subscribe((member:any)=>{
      this.member=member;
    })
  }
  updateForm(){
    // this.memberService.updateMember(this.member||'{}').subscribe(()=>{
    //   this.toastrService.success("Profile updated successfully");

    // });
    console.log(this.member);
  }
}
