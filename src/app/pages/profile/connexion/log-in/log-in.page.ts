import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { local } from 'd3';
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
    private authService : AuthService,
    private userService : UserService) { }

  newUser : User = new User();

  errorMessage : string = "";

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
  
    // Verification info connexion -> recup token
    this.authService.logIn(this.newUser).subscribe(
      {
        next: (res : any) => {

          this.authService.setToken(res.token);

          // Token -> recup user infos
          this.userService.getUserInDatabase().subscribe({

            next: (res : any) => {
              console.log(res);
              localStorage.setItem('user', JSON.stringify(res));
              this.router.navigate(['tabs/profile']);
            },
            error: (err : HttpErrorResponse) => {
              console.log(err);
              this.errorMessage = err.error;
            }
          });
        },
        error: (err : HttpErrorResponse) => {
          
          if (err.status == 401){
            this.errorMessage = "Email ou mot de passe incorrect.";
          }
          else{
            this.errorMessage = err.error;
          }

        }
      }
    );
  }

  

}
