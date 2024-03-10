import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(
    private router : Router,
    private userService : UserService,
    private firebaseService : FirebaseService,
  ) { }

  user : User | null = null;

  lastUser : User | null = null;

  file: File | null = null;

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.lastUser = JSON.parse(JSON.stringify(user));
    });
  }


  fileUpload(event : any){

    this.file = event.target.files[0];
  }


  canModifyUser(){
    return this.user != null && this.lastUser != null && JSON.stringify(this.user) != JSON.stringify(this.lastUser) || this.file != null;
  }

  modifyUser(){
    if(this.user != null){

      if (this.file != null){
        // this.userService.updateUser(this.user, this.file).then(res => {
        //   // console.log(res);
        //   this.router.navigate(['tabs/profile']);
          
        // });

        this.firebaseService.uploadAvatarImage(this.user, this.file).then(url => {

          this.user!.avatar = url;

          console.log('user with updated avatar',this.user);

          this.userService.updateUser(this.user!).subscribe(res => {
            // console.log(res);
            this.router.navigate(['tabs/profile']);
          });
        });
      }
      else {
        this.userService.updateUser(this.user!).subscribe(res => {
          // console.log(res);
          this.router.navigate(['tabs/profile']);
        });
      }
      
    }
  }

}

