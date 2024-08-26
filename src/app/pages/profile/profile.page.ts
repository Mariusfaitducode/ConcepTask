import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private translate: TranslateService,
    private router : Router,
    private route : ActivatedRoute,
    private userService : UserService,
    private authService : AuthService) { }


  user : User | null = new User();
  userConnected : boolean = false;


  ngOnInit() {

    this.userService.getUser().subscribe((user : User | null) => {

      console.log('ProfilePage : user = ', user);
      this.user = user;
      
      if (this.user != null){
        this.userConnected = true;
      }
    });

    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{

      let settings = new Settings();
      settings.initPage(this.translate);

      // this.user = this.userService.getUser();

      // console.log(this.user)

      
    });
  }

  goToSettings(){
    this.router.navigate(['/settings']);
  }

  goToLogin(){
    this.router.navigate(['tabs/profile/log-in']);
  }

  goToSignUp(){
    this.router.navigate(['tabs/profile/sign-up']);
  }

  goToEditProfile(){
    this.router.navigate(['tabs/profile/edit-profile']);
  }

  disconnect(){

    console.log('Profile page : disconnect')

    // localStorage.removeItem('token');
    this.userConnected = false;
    this.user = null;

    // this.taskService.loadTodos(null);

    this.authService.logout();
  }

}
