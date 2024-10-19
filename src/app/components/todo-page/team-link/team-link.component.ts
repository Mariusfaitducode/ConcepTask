import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-team-link',
  templateUrl: './team-link.component.html',
  styleUrls: ['./team-link.component.scss',
    '../../cards/sub-task/sub-task.component.scss'
  ],
})
export class TeamLinkComponent  implements OnInit {

  constructor(private router: Router) { }

  @Input() team!: Team;

  ngOnInit() {}

  goToTeam(){
    this.router.navigate(['/team', this.team.id]);
  }

}
