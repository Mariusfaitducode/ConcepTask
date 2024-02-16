import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  constructor(
    private router : Router,
    private authService : AuthService) { }

  newUser : User = new User();


  ngOnInit() {
  }


  // NAVIGATION

  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }

  goToSignUpPage(){
    this.router.navigate(['tabs/profile/sign-up']);
  }

  goToHomePage(){
    this.router.navigate(['/tabs/home']);
  }


  // FORM

  validForm(){
    return this.newUser.email != "" && this.newUser.password != "";
  }

  logIn(){
    console.log(this.newUser);

    // this.userService.postUser(this.newUser).subscribe((res : any) => {
    //   console.log(res);
    // });
  
    this.authService.logIn(this.newUser).subscribe((res : any) => {
      console.log(res);
    });
  
  }

  

}
