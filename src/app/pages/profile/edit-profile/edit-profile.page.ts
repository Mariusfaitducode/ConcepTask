import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
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
  ) { }

  user : User | null = null;

  lastUser : User | null = null;

  file: File | null = null;

  ngOnInit() {
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

  fileUpload(event : any){

    this.file = event.target.files[0];

    // TODO : display file after selecting it
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

}

