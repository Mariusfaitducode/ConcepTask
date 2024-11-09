import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RequestResponse } from 'src/app/models/firebase-response';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private userService : UserService,
    private authService : AuthService,
    private settingsService : SettingsService,
    private translate: TranslateService
  ) { }

  user : User | null = null;

  lastUser : User | null = null;

  file: File | null = null;

  errorMessage : string = "";

  // EDIT EMAIL
  editMode : null | "mail" | "password" = null;


  newEmail : string = "";
  errorMessageMail : string = "";

  // EDIT PASSWORD
  // editPassword = false;
  newPassword : string = "";
  errorMessagePassword : string = "";

  @ViewChild('fileInput') fileInput!: ElementRef;
  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit() {


    this.route.params.subscribe(params => {

      this.settingsService.initPage(this.translate);


      // Reset error messages and form fields on page refresh
      this.errorMessage = "";
      this.errorMessageMail = "";
      this.errorMessagePassword = "";

      this.newEmail = "";
      this.newPassword = "";

      // Reset edit mode
      this.editMode = null;

      // Reset file upload
      this.file = null;
      this.imagePreview = null;

      this.userService.getUser().subscribe(user => {

        console.log('Edit profile page : user = ', user)
  
        this.user = JSON.parse(JSON.stringify(user));
        this.lastUser = JSON.parse(JSON.stringify(user));
      });
    })
    
  }


  // NAVIGATION

  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }


  // FORM

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  fileUpload(event: any) {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.file);
      // Ici, vous pouvez également ajouter la logique pour envoyer le fichier au serveur
    }
  }


  canModifyUser(){
    return this.user != null && this.lastUser != null && (JSON.stringify(this.user) != JSON.stringify(this.lastUser) || this.imagePreview != null);
  }

  async modifyUser(){
    
    if(this.user != null){

      // await this.userService.updateUser(this.user, this.file);

      let response : RequestResponse = new RequestResponse(false, '');

      if (this.file != null){
        response = await this.userService.updateUserAvatar(this.user, this.file);
      }
      else if (JSON.stringify(this.user) != JSON.stringify(this.lastUser)){
        response = await this.userService.updateUser(this.user);
      }

      // const success = await this.userService.updateUser(this.user, this.file);

      if (response.success) {
        console.log('User profile updated successfully');
        this.router.navigate(['/profile']); // Naviguer vers la page de profil
      } else {
        console.log('Failed to update profile');

        this.errorMessage = response.errorMessage;
        // Afficher un message d'erreur ou effectuer une autre action
      }
    }
  }


  // editMailOrPassword(editMode : null | "mail" | "password"){

  //   this.errorMessageMail = "";
  //   this.errorMessagePassword = "";
  //   this.newEmail = '';
  //   this.newPassword = '';

  //   if (this.editMode === editMode){
  //     this.editMode = null;
  //   }
  //   else{
  //     this.editMode = editMode
  //   }
  // }


  // validEmail(){
  //   return this.newEmail != "" && this.newEmail != this.user?.email;
  // }


  // async modifyEmail(){
  //   // const success = await this.userService.updateUserEmail(this.newEmail);
  
  //   const response = await this.authService.updateUserEmail(this.newEmail);

  //   this.errorMessageMail = response.errorMessage;

  //   if (response.user){
  //     this.router.navigate(['/profile']);
  //   }
  // }


  // async modifyPassword(){
  //   const response = await this.authService.updateUserPassword(this.newPassword);

  //   this.errorMessagePassword = response.errorMessage;

  //   if (response.user){
  //     this.router.navigate(['/profile']);
  //   }
  // }

}

