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
import { User, UserSimplified } from 'src/app/models/user';

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


  async acceptInvitation(user : User, invitation: TeamInvitation) {
    try {
      
      // Add user to the team
      await this.teamService.addUserToTeam(invitation.teamId, user);

      // TODO : add id infos on team invitation
      // Remove invitation from user's invitations
      // await this.firestore.collection('users').doc(user.uid).collection('teamInvitations').doc(invitation.id).delete();

      

      console.log(`Invitation accepted for team ${invitation.teamName}`);
      return true;
    } catch (error) {
      console.error('Error accepting team invitation:', error);
      return false;
    }
  }

  // async rejectInvitation(invitation: TeamInvitation) {
  //   try {
  //     const userId = await this.afAuth.currentUser.then(user => user.uid);

  //     // Remove invitation from user's invitations
  //     await this.firestore.collection('users').doc(userId).collection('teamInvitations').doc(invitation.id).delete();

  //     // Remove user from team's pending invitations
  //     const team = await this.teamService.getTeam(invitation.team.id).toPromise();
  //     team.pendingInvitationsUserIds = team.pendingInvitationsUserIds.filter(id => id !== userId);
  //     await this.teamService.updateTeam(team);

  //     console.log(`Invitation rejected for team ${invitation.team.name}`);
  //     return true;
  //   } catch (error) {
  //     console.error('Error rejecting team invitation:', error);
  //     return false;
  //   }
  // }
}
