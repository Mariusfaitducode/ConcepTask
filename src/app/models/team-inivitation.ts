import { Team } from "./team";


export class TeamInvitation {


    teamId: string;
    teamName: string;
    senderId: string;
    receiverId: string;
    status: string;
    createdAt: Date;

    constructor(team : Team, userId: string, senderId: string){
        this.teamId = team.id;
        this.teamName = team.name;
        this.senderId = senderId;
        this.receiverId = userId;
        this.status = 'pending';
        this.createdAt = new Date();
    }
}
