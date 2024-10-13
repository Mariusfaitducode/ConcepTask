import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Team } from 'src/app/models/team';
import { TeamInvitation } from 'src/app/models/team-inivitation';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import { TeamService } from './team.service';
import { Observable } from 'rxjs';
import { UserSimplified } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class TeamInvitationsService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private teamService: TeamService
  ) { }



   // TEAM INVITATIONS



   async sendInvitationToUser(team: Team, userId: string, sender: UserSimplified) {
    try {
      // Create an invitation object
      let invitation = new TeamInvitation(team, userId, sender);

      invitation = JSON.parse(JSON.stringify(invitation));

      // Add the invitation to a 'teamInvitations' collection in Firestore
      await this.firestore.collection('users').doc(userId).collection('teamInvitations').add(invitation);

      if (!team.pendingInvitationsUserIds){
        team.pendingInvitationsUserIds = [];
      }

      team.pendingInvitationsUserIds.push(userId);
      this.teamService.updateTeam(team);

      // Optionally, update the user's document to include a reference to this invitation
      // await this.firestore.doc(`users/${userId}`).update({
      //   pendingInvitations: firebase.firestore.FieldValue.arrayUnion(invitation)
      // });

      // Optionally, send a notification to the user (this would require additional setup)
      // await this.notificationService.sendNotification(userId, `You've been invited to join ${team.name}`);

      console.log(`Invitation sent to user ${userId} for team ${team.name}`);
      return true;
    } catch (error) {
      console.error('Error sending team invitation:', error);
      return false;
    }
  }


  getTeamInvitationsOfUser(userId: string): Observable<TeamInvitation[]> {
    return this.firestore.collection('users').doc(userId).collection('teamInvitations').valueChanges() as Observable<TeamInvitation[]>;
  }
}
