import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Team } from 'src/app/models/team';
import { User, UserSimplified } from 'src/app/models/user';
import { TeamInvitationsService } from 'src/app/services/team/team-invitations.service';
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

  initialTeam: Team | null = null;

  teamInvitationUsers: UserSimplified[] = [];
  teamUsers: UserSimplified[] = [];

  searchMembersResult: UserSimplified[] = [];

  // teams: {teams:Team, teamUsers:any[]}[] = [];

  user: User | null = null;


  searchTerm: string = '';

  // members: User[] = [];
  // filteredMembers: TeamMember[] = [];

  file: File | null = null;
  fileUrl: string = '';


  isNewTeam: boolean = false;


  constructor(
    private route : ActivatedRoute, 
    private router: Router,
    private alertController: AlertController,
    private userService: UserService,
    private teamService: TeamService,
    private teamInvitationsService: TeamInvitationsService
  ) { }

  ngOnInit() {


    

    this.route.params.subscribe((params) => {

      console.log('TeamPage : params = ', params);


      this.userService.getUser().subscribe((user : User | null) => {

        console.log('ProfilePage : user = ', user);
        this.user = user;
        
        if (this.user != null){
          // this.userConnected = true;
          this.team = new Team(this.user!);


          if (params['id'] == undefined) {

            this.isNewTeam = true;
            this.team = new Team(this.user!);

          }

          else{ 
            this.isNewTeam = false;
            this.teamService.getTeamById(params['id']).subscribe((team : Team | null) => {

              if (team && JSON.stringify(team) != JSON.stringify(this.team)){

                console.log('team = ', team);

                this.team = team;

                this.initialTeam = {...team}

                this.teamUsers = [];

                for (let userId of team.usersIds){
  
                  this.userService.getUserById(userId).then(user => {
    
                    if (user && !this.teamUsers.includes(user)) this.teamUsers.push(user);
                  });
                }

                this.teamInvitationUsers = [];

                for (let userId of team.pendingInvitationsUserIds){
                  this.userService.getUserById(userId).then(user => {
                    if (user && !this.teamInvitationUsers.includes(user)) this.teamInvitationUsers.push(user);
                  });
                }
              }
            }); 
          }
        }
      });
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

    // console.log("search ")

    if (this.searchTerm == ''){
      this.searchMembersResult = [];
      return;
    }

    this.searchMembersResult = []

    this.userService.searchMembers(this.searchTerm).then(result => {
      this.searchMembersResult = result;

      console.log('membersResult = ', this.searchMembersResult);

    });
  }


  isMemberAlreadyInTeamOrInvited(uid: string){
    return this.team!.usersIds.includes(uid) || this.team!.pendingInvitationsUserIds.includes(uid);
  }


  sendInvitationToUser(userId: string){

    let userSimplified = new UserSimplified(this.user!.uid, this.user!.pseudo, this.user!.avatar);

    this.teamInvitationsService.sendInvitationToUser(this.team!, userId, userSimplified);

    // this.team!.usersIds.push(uid);

    // Send an invitation to the user


  }


  canSaveOrUpdateTeam(){
    if (this.isNewTeam){
      return this.user && this.team && this.team.name !== '';
    }
    else{
      return this.team && this.initialTeam && JSON.stringify(this.team) !== JSON.stringify(this.initialTeam) || this.file != null;
    }
  }

  // canUpdateTeam(){
  //   return this.team && this.initialTeam && JSON.stringify(this.team) !== JSON.stringify(this.initialTeam) || this.file != null;
  // }

  async saveNewTeam(){
    // TODO : fix image upload, must actualize better

    let success = false

    if (this.isNewTeam){
      success = await this.teamService.createNewTeam(this.team!, this.user!);
      if (this.file){
        success = await this.teamService.updateTeamImage(this.team!, this.file);
      }
    }
    else{

      if (this.file){
        success = await this.teamService.updateTeamImage(this.team!, this.file);
      }
      else{
        success =await this.teamService.updateTeam(this.team!);
      }
    }

    if (success) {
      console.log('Team updated successfully');
      this.router.navigate(['/profile']); // Naviguer vers la page de profil
    } else {
      console.log('Failed to update team');
      // Afficher un message d'erreur ou effectuer une autre action
    }

  }

}
