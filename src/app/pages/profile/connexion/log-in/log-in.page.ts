import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { local } from 'd3';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TaskService } from 'src/app/services/task.service';
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
  
    // Verification info connexion -> recup token
    // this.authService.logIn(this.newUser).subscribe(
    //   {
    //     next: (res : any) => {

    //       this.authService.setToken(res.token);

    //       // Récupération de l'utilisateur authentifié
    //       this.userService.getUserWithToken().subscribe(
    //         {
    //         next: (res : any) => {

    //           // Actualisation des todos
    //           this.taskService.loadTodos(res);

    //           this.router.navigate(['tabs/profile']);
    //         },
    //         error: (err : HttpErrorResponse) => {
    //           console.log(err);
    //           this.errorMessage = err.error;
    //         }
    //       });
    //     },
    //     error: (err : HttpErrorResponse) => {
          
    //       if (err.status == 401){
    //         this.errorMessage = "Email ou mot de passe incorrect.";
    //       }
    //       else{
    //         this.errorMessage = err.error;
    //       }
    //     }
    //   }
    // );
  }

  

}
