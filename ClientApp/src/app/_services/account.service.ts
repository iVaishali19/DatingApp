import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit {
  baseUrl =  environment.apiUrl;
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable() ;

  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    if(this.currentUser$ == null){
      localStorage.removeItem('user');
      this.currentUserSource.next(null);
    }
  
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: any) => {
        console.log(response);
        const user:User = response;
        if (user) {
        
          this.setCurrentUser(user);
          
        }
      })

    )
  }
  setCurrentUser(user: User) {
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: any) => {
        if (user) {
          this.setCurrentUser(user);
          
        }        
      })
    )
  }
}
