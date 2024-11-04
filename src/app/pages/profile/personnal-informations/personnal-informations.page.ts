import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dialog } from '@capacitor/dialog';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-personnal-informations',
  templateUrl: './personnal-informations.page.html',
  styleUrls: ['./personnal-informations.page.scss'],
})
export class PersonnalInformationsPage implements OnInit {

  constructor(
    private authService : AuthService,
    private userService : UserService,
    private translate : TranslateService,
    private router: Router) { }


  user : User | null = null;

  lastUser : User | null = null;



  // EDIT EMAIL
  editMode : null | "mail" | "password" = null;


  newEmail : string = "";
  errorMessageMail : string = "";

  // EDIT PASSWORD
  // editPassword = false;
  newPassword : string = "";
  errorMessagePassword : string = "";


  // DELETE ACCOUNT
  errorMessageDelete : string = "";

  ngOnInit() {

    this.userService.getUser().subscribe(user => {

      console.log('Edit profile page : user = ', user)

      this.user = JSON.parse(JSON.stringify(user));
      this.lastUser = JSON.parse(JSON.stringify(user));
    });
  }


  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }

  editMailOrPassword(editMode : null | "mail" | "password"){

    this.errorMessageMail = "";
    this.errorMessagePassword = "";
    this.newEmail = '';
    this.newPassword = '';

    if (this.editMode === editMode){
      this.editMode = null;
    }
    else{
      this.editMode = editMode
    }
  }


  validEmail(){
    return this.newEmail != "" && this.newEmail != this.user?.email;
  }


  async modifyEmail(){
    // const success = await this.userService.updateUserEmail(this.newEmail);
  
    const response = await this.authService.updateUserEmail(this.newEmail);

    this.errorMessageMail = response.errorMessage;

    if (response.user){
      this.router.navigate(['/profile']);
    }
  }


  async modifyPassword(){
    const response = await this.authService.updateUserPassword(this.newPassword);

    this.errorMessagePassword = response.errorMessage;

    if (response.user){
      this.router.navigate(['/profile']);
    }
  }


  async showDeleteAccountConfirm(){

    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DELETE ACCOUNT WARNING')}`,
    });

    // Si l'utilisateur confirme, alors on supprime le compte
    if (value) {

      const response = await this.authService.deleteUserAccount();

      this.errorMessageDelete = response.errorMessage;

      if (response.success){
        this.router.navigate(['/profile']);
      }
    }
  }
}
