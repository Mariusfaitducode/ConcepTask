import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/models/team';
import { TeamInvitation } from 'src/app/models/team-inivitation';

@Component({
  selector: 'app-teams-gestion',
  templateUrl: './teams-gestion.component.html',
  styleUrls: ['./teams-gestion.component.scss'],
})
export class TeamsGestionComponent  implements OnInit {

  constructor(
    private router: Router

  ) { }


  @Input() teams: {team:Team, teamUsers:any[]}[] = [];

  @Input() teamInvitations: TeamInvitation[] = [];

  ngOnInit() {}



  addTeam(){

    this.router.navigate(['/team']);

  }

  goToTeam(teamId: string){

    this.router.navigate(['/team', teamId]);

  }

}
