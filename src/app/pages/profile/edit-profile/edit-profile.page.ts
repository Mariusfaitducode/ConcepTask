import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(
    private router : Router,
    private userService : UserService,
    private authService : AuthService
  ) { }

  user : User | null = null;

  lastUser : User | null = null;

  file: File | null = null;

  // EDIT EMAIL
  editMail = false;
  newEmail : string = "m@g.com";
  errorMessageMail : string = "";

  // EDIT PASSWORD
  editPassword = false;

  @ViewChild('fileInput') fileInput!: ElementRef;
  imagePreview: string | ArrayBuffer | null = null;

  ngOnInit() {

    this.newEmail = this.user?.email || "";

    this.userService.getUser().subscribe(user => {

      console.log('Edit profile page : user = ', user)

      this.user = user;
      this.lastUser = JSON.parse(JSON.stringify(user));
    });
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
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      // Ici, vous pouvez également ajouter la logique pour envoyer le fichier au serveur
    }
  }


  canModifyUser(){
    return this.user != null && this.lastUser != null && JSON.stringify(this.user) != JSON.stringify(this.lastUser) || this.file != null;
  }

  async modifyUser(){
    
    if(this.user != null){

      // await this.userService.updateUser(this.user, this.file);

      let success = false

      if (this.file != null){
        success = await this.userService.updateUserAvatar(this.user, this.file);
      }
      else{
        success = await this.userService.updateUser(this.user);
      }

      // const success = await this.userService.updateUser(this.user, this.file);

      if (success) {
        console.log('User profile updated successfully');
        this.router.navigate(['/profile']); // Naviguer vers la page de profil
      } else {
        console.log('Failed to update profile');
        // Afficher un message d'erreur ou effectuer une autre action
      }
    }
  }


  validEmail(){

    console.log('newEmail = ', this.newEmail)
    console.log('user?.email = ', this.user?.email)

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

}

