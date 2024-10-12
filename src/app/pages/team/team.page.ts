import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { TeamService } from 'src/app/services/team/team.service';
import { UserService } from 'src/app/services/user/user.service';

// interface TeamMember {
//   id: number;
//   name: string;
//   role: string;
//   image: string;
// }

@Component({
  selector: 'app-team',
  templateUrl: './team.page.html',
  styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {



  // teamName: string = 'Mon Équipe';
  // teamImage: string = 'https://example.com/default-team-image.jpg';

  team: Team | null = null;
  teamUsers: any[] = [];

  // teams: {teams:Team, teamUsers:any[]}[] = [];

  user: User | null = null;


  searchTerm: string = '';

  // members: User[] = [];
  // filteredMembers: TeamMember[] = [];

  file: File | null = null;
  fileUrl: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private teamService: TeamService
  ) { }

  ngOnInit() {


    this.userService.getUser().subscribe((user : User | null) => {

      console.log('ProfilePage : user = ', user);
      this.user = user;
      
      if (this.user != null){
        // this.userConnected = true;
        this.team = new Team(this.user!);
      }
    });




    // Initialiser avec quelques membres d'exemple
    // this.members = [
    //   { id: 1, name: 'Alice Dupont', role: 'Développeur', image: 'https://example.com/alice.jpg' },
    //   { id: 2, name: 'Bob Martin', role: 'Designer', image: 'https://example.com/bob.jpg' },
    //   { id: 3, name: 'Charlie Leclerc', role: 'Chef de projet', image: 'https://example.com/charlie.jpg' },
    // ];
    // this.filteredMembers = [...this.members];
  }




  // NAVIGATION

  goBackTodo(){
    this.router.navigate(['/tabs/profile']);
  }



  fileUpload(event : any){

    this.file = event.target.files[0];
    // this.fileUrl = URL.createObjectURL(this.file);

    // TODO : display file after selecting it
  }


  changeTeamImage() {
    // Ici, vous pouvez implémenter la logique pour changer l'image de l'équipe
    // Par exemple, ouvrir un sélecteur de fichiers ou une galerie
    console.log("'Changer l'image de l'équipe'");
  }

  searchMembers() {
    // this.filteredMembers = this.members.filter(member =>
    //   member.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
    //   member.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    // );
  }



  canSaveTeam(){
    return this.user && this.team && this.team.name !== '';
  }

  saveNewTeam(){
    // TODO : save the team

    if (this.canSaveTeam()){
      this.teamService.createNewTeam(this.team!, this.user!);

    }

  }

}
