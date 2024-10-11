import { User } from "./user";



export class Team{

    id: string = "";
    name: string = "";  
    image?: string = "";

    users: User[] = [];
}
