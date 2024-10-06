import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Settings } from 'src/app/models/settings';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  constructor(
    private translate: TranslateService,
    private router : Router,
    private route : ActivatedRoute,
    private userService : UserService,
    private authService : AuthService,
    private settingsService : SettingsService
  ) { }


  userSubscription! : Subscription;
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

      this.settingsService.initPage(this.translate);
    });
  }


  ngOnDestroy(){

    console.log("PROFILE PAGE ON DESTROY")

    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }




  goToSettings(){
    this.router.navigate(['/settings']);
  }

  goToLogin(){
    this.router.navigate(['tabs/profile/connexion']);
  }

  goToSignUp(){
    this.router.navigate(['tabs/profile/connexion/sign-up']);
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
