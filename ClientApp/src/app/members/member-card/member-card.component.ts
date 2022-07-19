import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
  
})
export class MemberCardComponent implements OnInit {
  @Input() member? : Member  ;
  constructor(private memeberService : MembersService, private toastr:ToastrService ) { 
    
  }

  ngOnInit(): void  {
    console.log(this.member);
  }
  
  addLike(member:Member){
    this.memeberService.addLikes(member.userName).subscribe(()=>{
      this.toastr.success("You have liked"+ member.knownAs);
    });
  }
  
}