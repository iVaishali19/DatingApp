import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { CustomValidationService } from '../_services/custom-validation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  registerForm:FormGroup;
  submitted = false;
  maxDate:Date;
  validationErrors:string[] =[];

  constructor(private accountService: AccountService, private customValidator:CustomValidationService,
    private fb : FormBuilder, private toastrService:ToastrService , private router: Router) { }

  ngOnInit(): void {
    this.intializeForm();
    this.maxDate = new Date;
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  intializeForm(){

    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required,this.matchValues("password") ]]

      // name: ['', Validators.required],
      // // email: ['', [Validators.required, Validators.email]],
      // username: ['', [Validators.required], this.customValidator.userNameValidator.bind(this.customValidator)],
      // password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      // confirmPassword: ['', [Validators.required]],
    },
      // {
      //   validator: this.customValidator.MatchPassword('password', 'confirmPassword'),
      // }
    );

    // this.registerForm= this.fb.group({
    //   username: new FormControl('',Validators.required),
    //   password: new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //   confirmPassword:new FormControl('',[Validators.required,this.matchValues("password") ])
    // })
    // this.registerForm.get('password')?.valueChanges.subscribe(()=>{
    //   this.registerForm.get('confirmPassword')?.value.updateValueAndValidity();
    // })
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  matchValues(matchTo:string):ValidatorFn{
    
    return (control:AbstractControl) =>{  
      return control?.value=== this.registerForm.get('confirmPassword') ? null:{isMatching:true}
      
      //return control?.value=== control?.parent?.controls[matchTo].value ? null:{isMatching:true}
//      console.log(control?.value);
      //console.log(control?.parent?.controls.map ) ;
      // return this.registerForm.get('password')?.value === this.registerForm.get('confirmPassword')?.value 
      // ? { isMatching:false }:{ isMatching:true };
      
    }
  }

  register() {
    // this.submitted = true;
    // if (this.registerForm.valid) {
    //   alert('Form Submitted succesfully!!!\n Check the values in browser console.');
    //   console.table(this.registerForm.value);
    // }
    // console.log(this.registerForm.value);
    this.accountService.register(this.model).subscribe((res: any) => {
      this.router.navigateByUrl('/members');
      this.cancel();
    },
      error => {
        this.validationErrors=error;
        
      }
    )
    console.log(this.model);
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
