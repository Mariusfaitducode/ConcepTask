import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(
    private router : Router,
    private authService : AuthService) { }

  newUser : User = new User();

  passwordConfirmation : string = "";

  ngOnInit() {
  }


  // NAVIGATION

  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }

  goToLogInPage(){
    this.router.navigate(['tabs/profile/log-in']);
  }

  goToHomePage(){
    this.router.navigate(['/tabs/home']);
  }


  // FORM

  validForm(){
    return this.newUser.firstname != "" && this.newUser.lastname != "" && this.newUser.pseudo != "" && this.newUser.email != "" && this.newUser.password != "";
  }

  validPassword(){
    return this.newUser.password == this.passwordConfirmation;
  }

  signUp(){

    this.authService.signUp(this.newUser).subscribe((res : any) =>{

      if (res.error){
        console.log(res.error);
      } 
      else {
        console.log(res);
        this.router.navigate(['tabs/profile/log-in']);
      }
      
      // next: (res : any) => {
      //   console.log(res);
      //   this.router.navigate(['tabs/profile/log-in']);
      // },
      // error: (err : any) => {
      //   console.log(err);
      // }
    });
  }

 
}
