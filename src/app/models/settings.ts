import { TranslateService } from "@ngx-translate/core";
import { Category } from "./category";



export class Settings{

    firstVisitedDone : boolean = false;
    
    // Theme color settings
    darkMode : boolean = true;
    themeColor : string = '#3880ff';

    // Language settings
    language : string = 'en';


    // Todo settings
    categories : Category[] = [
        {
          id: 0,
          name: "Task",
          color: "#e83c53"
        },
        {
          id: 1,
          name: "Project",
          color: "#428cff"
        },
        {
          id: 2,
          name: "Work",
          color: "#ffd948"
        },
        {
          id: 3,
          name: "Personal",
          color: "#29c467"
        },
        {
          id: 4,
          name: "Event",
          color: "#5d58e0"
        }
      ];

    
    constructor(){
        let settings = JSON.parse(localStorage.getItem('settings') || 'null');

        if (settings){

            console.log('get settings from local storage in constructor');

            this.firstVisitedDone = settings.firstVisitedDone;

            this.darkMode = settings.darkMode;
            this.themeColor = settings.themeMode || '#3880ff';

            this.language = settings.language;

            this.categories = settings.categories;
        }
    }
}