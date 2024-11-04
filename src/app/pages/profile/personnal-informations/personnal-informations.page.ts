import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personnal-informations',
  templateUrl: './personnal-informations.page.html',
  styleUrls: ['./personnal-informations.page.scss'],
})
export class PersonnalInformationsPage implements OnInit {

  constructor(private router: Router) { }

  email : string = "";
  newPassword : string = "";

  ngOnInit() {
  }


  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }

  updateEmail(){

  }

  updatePassword(){

  }

  confirmDeleteAccount(){

  }
}
