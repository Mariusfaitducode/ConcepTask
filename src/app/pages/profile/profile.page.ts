import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(private router : Router) { }


  userConnected : boolean = false;


  ngOnInit() {
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



}
