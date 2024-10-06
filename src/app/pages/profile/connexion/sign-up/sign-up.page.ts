import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TaskService } from 'src/app/services/task/task.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(
    private router : Router,
    private authService : AuthService,) { }

  newUser : User = new User();

  passwordConfirmation : string = "";

  errorMessage : string = "";

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
    return this.newUser.pseudo != "" && this.newUser.email != "" && this.newUser.password != "";
  }

  validPassword(){

    console.log(this.newUser.password?.length);

    return this.newUser.password == this.passwordConfirmation;
  }


  // AUTHENTIFICATION

  async signUp(){

    const response = await this.authService.signUp(this.newUser.email, this.newUser.password!, this.newUser.pseudo);
    
    this.userSignUpResult(response);
  }

  userSignUpResult(response : any){
    if (response.user) {
      console.log('User signed in:', response.user);
      this.errorMessage = response.errorMessage;

      // Utilisateur connecté, retour à la page profil
      this.router.navigate(['tabs/profile']);
    } 
    else { // Erreur lors de l'inscription
      console.log('Sign up failed');
      this.errorMessage = response.errorMessage;
    }
  }

}
