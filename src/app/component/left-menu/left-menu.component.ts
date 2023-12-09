import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { Share } from '@capacitor/share';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss'],
})
export class LeftMenuComponent  implements OnInit {

  constructor(private router : Router,
    private socialSharing: SocialSharing) { }

  ngOnInit() {}


  goToCalendar(){
    this.router.navigate(['/calendar']);
  }

  goToSettings(){
    this.router.navigate(['/settings']);
  }

  goToDoneTasks(){
    this.router.navigate(['/done-task']);
  }

  goToFeedback(){
    this.router.navigate(['/feedback']);
  }


  // shareApp() {
  //   const message = 'Téléchargez notre application ici : [votre lien]';
  //   const subject = 'Partager l\'application';
  
  //   // Utiliser le plugin SocialSharing pour partager le message
  //   this.socialSharing.share(message, subject).then(() => {
  //     console.log('Partage réussi !');
  //   }).catch((error) => {
  //     console.error('Erreur de partage :', error);
  //   });
  // }

  async shareApp() {
    await Share.share({
      title: 'Téléchargez ConcepTask',
      text: `Téléchargez l'application ConcepTask :`,
      url: 'https://conceptask.com',
      dialogTitle: 'Partager'
    });
  }

  
}
