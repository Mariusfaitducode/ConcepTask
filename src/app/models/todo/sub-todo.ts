import { ScheduleEvery } from "@capacitor/local-notifications";
// import { Notif } from "../notif";
import { TaskConfig } from "../task-config";
import { Category } from "../category";
import { TranslateService } from "@ngx-translate/core";

import { v4 as uuidv4 } from 'uuid';
import { SettingsService } from "../../services/settings/settings.service";
import { TodoProperties } from "./todo-properties";

export class SubTodo {

    // IDs
    public id: string; // id of the todo

    // public index: number; // index of the todo in the list

    public subId?: number; // id of reference on the tree 
    public parentId?: number; // id of the parent todo  


    public properties: TodoProperties = new TodoProperties();

    public list: SubTodo[] = [];


    constructor(id : string = uuidv4()) {

        this.id = id;
        
        // this.category = SettingsService.getCategories()[0];
        // this.developped = true;

        // this.repeat = {};

        // this.config = new TaskConfig(); 

        // this.index = todoListLength;
    }

  }



