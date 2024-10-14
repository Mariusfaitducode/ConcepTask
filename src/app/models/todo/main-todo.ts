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

    public index: number; // index of the todo in the list
    
    public hideDoneTasks: boolean = false; // Hide the done tasks only useful for mainTodo


    // Space informations

    public onTeamSpace: boolean = false;
    public spaceId: string = '';


    // Todo properties

    public properties: TodoProperties = new TodoProperties();

    public list: SubTodo[] = [];


    constructor(todoListLength: number) {

        this.id = uuidv4();
        
        // this.category = SettingsService.getCategories()[0];
        // this.developped = true;

        // this.repeat = {};

        // this.config = new TaskConfig(); 

        this.index = todoListLength;
    }

  }


