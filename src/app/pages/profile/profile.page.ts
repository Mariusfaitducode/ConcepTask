import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Settings } from 'src/app/models/settings';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private translate: TranslateService,
    private router : Router,
    private route : ActivatedRoute,) { }


  userConnected : boolean = false;


  ngOnInit() {

    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{

      let settings = new Settings();
      settings.initPage(this.translate);

      if (localStorage.getItem('user')){
        this.userConnected = true;
      }
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


  disconnect(){
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.userConnected = false;
  }

}
