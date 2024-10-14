import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamInvitation } from 'src/app/models/team-inivitation';
import { User } from 'src/app/models/user';
import { TeamInvitationsService } from 'src/app/services/team/team-invitations.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-teams-gestion',
  templateUrl: './teams-gestion.component.html',
  styleUrls: ['./teams-gestion.component.scss'],
})
export class TeamsGestionComponent  implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService,
    private teamInvitationsService: TeamInvitationsService

  ) { }


  @Input() teams: {team:Team, teamUsers:any[]}[] = [];

  @Input() teamInvitations: TeamInvitation[] = [];

  user : User| null = null;

  ngOnInit() {

    this.userService.getUser().subscribe((user: User | null) => {
      this.user = user;
    });

  }



  addTeam(){

    this.router.navigate(['/team']);

  }

  goToTeam(teamId: string){

    this.router.navigate(['/team', teamId]);

  }

  acceptInvitation(invitation: TeamInvitation){

    this.teamInvitationsService.acceptInvitation(this.user!, invitation);

  }


  rejectInvitation(invitation: TeamInvitation){

    this.teamInvitationsService.rejectInvitation(this.user!, invitation);
  }

}
