import { User } from "./user";

import { v4 as uuidv4 } from 'uuid';


export class Team{

    id: string = "";
    name: string = "";  
    image?: string = "";

    usersIds: string[] = [];

    adminId: string | null = null;


    constructor(admin: User){
        this.id = uuidv4();
        this.adminId = admin.uid;
        this.usersIds.push(admin.uid);
    }
}
