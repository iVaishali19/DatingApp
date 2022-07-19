import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  constructor(private toastr:ToastrService) { }

  ngOnInit(): void {
    this.registerMode = false;
  }

  registerToggle(){
    this.toastr.error('You shall not pass !');
    this.registerMode=!this.registerMode;
  }
  cancelRegisterMode(event:boolean){
    this.registerMode = event;
  }
}
