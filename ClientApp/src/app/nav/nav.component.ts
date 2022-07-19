import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any={};
  u:any;
  loggedIn:User;
  constructor(public accountService:AccountService, private router:Router, private toaster:ToastrService) { }

  ngOnInit(): void {
    
  }

  login(){
    this.accountService.login(this.model).subscribe((res:any)=>{
      this.router.navigateByUrl('/members');
      //this.loggedIn=true;
    }, error=>{      
      this.toaster.error(error.error);
    })   
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
    //this.loggedIn=false;
  }
  
  getCurrentUser(){
    this.accountService.currentUser$.subscribe(user=>{
      this.loggedIn=user!;

    },
    error=>{
      console.log(error);
    }
    )
  }
}
