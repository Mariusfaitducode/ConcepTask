import { TranslateService } from "@ngx-translate/core";
import { Category } from "./category";



export class Settings{

    firstVisitedDone : boolean = false;
    
    // Theme color settings
    darkMode : boolean = false;
    themeColor : string = '#3880ff';

    // Language settings
    language : string = 'en';


    // Todo settings
    categories : Category[] = [];



    
    constructor(){
        let settings = JSON.parse(localStorage.getItem('settings') || '{}');

        this.firstVisitedDone = settings.firstVisitedDone;

        this.darkMode = settings.darkMode;
        this.themeColor = settings.themeMode || '#3880ff';

        this.language = settings.language;
    }

    // initPage( translate : TranslateService){

    //     // if (this.darkMode) {
    //     //     document.body.setAttribute('color-theme', 'dark');
    //     // }
    //     // else{
    //     //     document.body.setAttribute('color-theme', 'light');
    //     // }
      
    //     // translate.use(this.language); 
    // }
}