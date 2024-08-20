import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { SyncService } from 'src/app/services/sync.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(
    private router : Router,
    private authService : AuthService,
    private userService : UserService,
    private syncService : SyncService) { }

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
    return this.newUser.firstname != "" && this.newUser.lastname != "" && this.newUser.pseudo != "" && this.newUser.email != "" && this.newUser.password != "";
  }

  validPassword(){
    return this.newUser.password == this.passwordConfirmation;
  }

  signUp(){

    this.authService.signUp(this.newUser.email, this.newUser.password!, this.newUser.pseudo, this.newUser.firstname!, this.newUser.lastname!);

    // this.authService.signUp(this.newUser).subscribe(
    //   {
    //   next: (res : any) => {
    //     console.log(res);

    //     // Synchronisation BDD res.token

    //     let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    //     if (todos.length == 0){ 
    //       this.router.navigate(['tabs/profile/log-in']);
    //     }
    //     else{
    //       this.syncService.setDatabaseTodos(res.token, todos).subscribe({

    //         next: (res : any) => {
    //           console.log(res);
    //           console.log('Synchronisation todos réussie')
    //           this.router.navigate(['tabs/profile/log-in']);
    //         },
    //         error: (res : HttpErrorResponse ) => {
    //           console.log(res);
    //         }
    //       });
    //     }
    //   },
    //   error: (res : HttpErrorResponse ) => {
    //     console.log(res);
    //     this.errorMessage = res.error.message;
    //   }
    // });
  }

}
