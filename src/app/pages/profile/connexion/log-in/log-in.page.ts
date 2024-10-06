import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { local } from 'd3';
import { AuthentificationResponse } from 'src/app/models/authentification-response';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  constructor(
    private router : Router,
    private authService : AuthService,
    private userService : UserService,) { }

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

  // AUTHENTIFICATION

  async logIn(){
    console.log(this.newUser);

    const response = await this.authService.login(this.newUser.email, this.newUser.password!);

    this.userLogInResult(response);
  }


  async logInWithGoogle(){
    const response = await this.authService.loginWithGoogle();
    
    this.userLogInResult(response);

  }


  async logInWithGitHub(){
    const response = await this.authService.loginWithGitHub();
    
    this.userLogInResult(response);
    
  }


  userLogInResult(response : AuthentificationResponse){
    if (response.user) {
      console.log('User logged in:', response.user);
      this.errorMessage = response.errorMessage;

      // Utilisateur connecté, retour à la page profil
      this.router.navigate(['tabs/profile']);
    } 
    else { // Erreur lors de la connexion

      console.log('Login failed');
      this.errorMessage = response.errorMessage;
    }
  }



  

}
