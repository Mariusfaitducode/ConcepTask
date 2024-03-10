import { Todo } from "./todo";


export class User{

    _id: number = 0;

    firstname: string = "";
    lastname: string = "";
    pseudo: string = "";
    email: string = "";
    password: string = "";
    status: string = "test";
    phone: string = "test";

    avatar: string = "";

    todos : Todo[] = [];
    
}