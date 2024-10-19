import { ScheduleEvery } from "@capacitor/local-notifications";
// import { Notif } from "../notif";
import { TaskConfig } from "../task-config";
import { Category } from "../category";
import { TranslateService } from "@ngx-translate/core";

import { v4 as uuidv4 } from 'uuid';
import { SettingsService } from "../../services/settings/settings.service";
import { SubTodo } from "./sub-todo";
import { TodoProperties } from "./todo-properties";

export class MainTodo {

    // IDs
    public id: string; // id of the todo

    public index: number = 0; // index of the todo in the list
    
    public hideDoneTasks: boolean = false; // Hide the done tasks only useful for mainTodo


    // Space informations

    public onTeamSpace: boolean = false;
    public spaceId: string = '';


    // Todo properties

    public properties: TodoProperties = new TodoProperties();

    public list: SubTodo[] = [];


    constructor(id : string = uuidv4()) {

        this.id = id;
    }

  }



