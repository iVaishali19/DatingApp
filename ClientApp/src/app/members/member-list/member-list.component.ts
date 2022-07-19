import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination:Pagination;
  pageNumber=1;
  pageSize=3;
  userParams:UserParams;
  user:User;
  store:any[] ;
  totalItems:number;

  genderList =[{value:'male', display:'Males'}, {value:'female', display:'Female'}]

  constructor(private memberService :MembersService , private accountService:AccountService) {
   

    this.userParams=this.memberService.getUserParams();
   }

  ngOnInit() {    
    this.loadMembers();
  }

  loadMembers(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe((res:any)=>{      
      this.members=res.result;
      this.pagination= res.pagination;
      // this.totalItems=this.pagination.totalItems;
      // console.log(this.totalItems);
    })
  }

  pageChanged(event:any){
    this.userParams.pageNumber=event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }

  apply(){    
      this.loadMembers();    
  }

  resetFilters(){
    this.userParams= this.memberService.resetUserParams();    
    this.loadMembers();
  }
}
