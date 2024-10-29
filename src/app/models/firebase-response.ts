import { User } from "./user";


export class AuthentificationResponse{

    user : User | null = null;
    errorMessage : string = "";

    constructor(user : User | null, errorMessage : string){
        this.user = user;
        this.errorMessage = errorMessage;
    }
}

export class RequestResponse{
    success: boolean;
    errorMessage: string;

    constructor(success: boolean, errorMessage: string){
        this.success = success;
        this.errorMessage = errorMessage;
    }
}
