import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { local } from 'd3';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TaskService } from 'src/app/services/task.service';
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
    private userService : UserService,
    private taskService : TaskService) { }

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


  async logIn(){
    console.log(this.newUser);

    const user = await this.authService.login(this.newUser.email, this.newUser.password!);

    if (user) {
      console.log('User logged in:', user);
      this.router.navigate(['tabs/profile']);
      // Naviguer vers une autre page ou effectuer d'autres actions
    } else {
      console.log('Login failed');
      this.errorMessage = "Connexion échouée. Email ou mot de passe incorrect.";
      // Afficher un message d'erreur
    }
  }


  async logInWithGoogle(){
    const user = await this.authService.loginWithGoogle();
    if (user) {
      this.router.navigate(['tabs/profile']);
    }
  }


  async logInWithGitHub(){
    const user = await this.authService.loginWithGitHub();
    if (user) {
      this.router.navigate(['tabs/profile']);
    }
  }



  

}
