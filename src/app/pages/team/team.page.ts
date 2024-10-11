import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {


  
  teamName: string = 'Mon Équipe';
  teamImage: string = 'https://example.com/default-team-image.jpg';
  searchTerm: string = '';
  members: TeamMember[] = [];
  filteredMembers: TeamMember[] = [];

  file: File | null = null;

  constructor(
    private router: Router,
    private alertController: AlertController) { }

  ngOnInit() {
    // Initialiser avec quelques membres d'exemple
    this.members = [
      { id: 1, name: 'Alice Dupont', role: 'Développeur', image: 'https://example.com/alice.jpg' },
      { id: 2, name: 'Bob Martin', role: 'Designer', image: 'https://example.com/bob.jpg' },
      { id: 3, name: 'Charlie Leclerc', role: 'Chef de projet', image: 'https://example.com/charlie.jpg' },
    ];
    this.filteredMembers = [...this.members];
  }




  // NAVIGATION

  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }



  fileUpload(event : any){

    this.file = event.target.files[0];

    // TODO : display file after selecting it
  }


  changeTeamImage() {
    // Ici, vous pouvez implémenter la logique pour changer l'image de l'équipe
    // Par exemple, ouvrir un sélecteur de fichiers ou une galerie
    console.log("'Changer l'image de l'équipe'");
  }

  searchMembers() {
    this.filteredMembers = this.members.filter(member =>
      member.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  async addNewMember() {
    const alert = await this.alertController.create({
      header: 'Ajouter un nouveau membre',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nom du membre'
        },
        {
          name: 'role',
          type: 'text',
          placeholder: 'Rôle du membre'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ajouter',
          handler: (data) => {
            if (data.name && data.role) {
              const newMember: TeamMember = {
                id: this.members.length + 1,
                name: data.name,
                role: data.role,
                image: 'https://example.com/default-avatar.jpg' // Image par défaut
              };
              this.members.push(newMember);
              this.filteredMembers = [...this.members];
              this.searchMembers(); // Rafraîchir la liste filtrée
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
