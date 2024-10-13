import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TaskService } from '../task/task.service';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { UserService } from '../user/user.service';
import { finalize, Observable } from 'rxjs';
import { TeamInvitation } from 'src/app/models/team-inivitation';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private taskService : TaskService,
    private userService: UserService
  ) { }



  getTeamById(teamId: string): Observable<Team | null> {

    return this.firestore.collection('teams').doc(teamId).valueChanges() as Observable<Team | null>;

  }

  getTeamsOfUser(user: User): Observable<Team[]> {

    return this.firestore.collection('teams', ref => ref.where('usersIds', 'array-contains', user.uid)).valueChanges() as Observable<Team[]>;

  }


  createNewTeam(team: Team, user: User){

    // Add the team on the firestore team collection

    team = JSON.parse(JSON.stringify(team));

    if (user){

      if (!user.teams){
        user.teams = [];
      }

      user.teams.push(team.id);

      this.userService.updateUser(user);

      this.firestore.collection('teams').doc(team.id).set(team);
    }
  }


  async updateTeamImage(team: Team, file: File){

    try {
        if (file) {
          const filePath = `team_pictures/${team.id}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, file);

          await uploadTask.snapshotChanges().pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              team.image = downloadURL;
              // await this.userRef!.update(user);
              // this.userSubject.next(user); // Mettre à jour l'utilisateur localement
              
            })
          ).toPromise();
        } 
        // else {
        //   await this.userRef.update(user);
        //   this.userSubject.next(user); // Mettre à jour l'utilisateur localement
        // }
        return true; // Mise à jour réussie
    } 
    catch (error) {
      console.error('Error updating user:', error);
      return false; // Une erreur s'est produite
    }
  }


  updateTeam(team: Team){

    this.firestore.collection('teams').doc(team.id).update(team);

  }



  async sendInvitationToUser(team: Team, userId: string, senderId: string) {
    try {
      // Create an invitation object
      let invitation = new TeamInvitation(team, userId, senderId);

      invitation = JSON.parse(JSON.stringify(invitation));

      // Add the invitation to a 'teamInvitations' collection in Firestore
      await this.firestore.collection('teamInvitations').add(invitation);

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

}
