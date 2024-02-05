import { TranslateService } from "@ngx-translate/core";



export class Settings{

    firstVisitedDone : boolean = false;
    
    darkMode : boolean = false;
    themeColor : string = '#3880ff';

    language : string = 'en';

    
    constructor(){
        let settings = JSON.parse(localStorage.getItem('settings') || '{}');

        this.firstVisitedDone = settings.firstVisitedDone;

        this.darkMode = settings.darkMode;
        this.themeColor = settings.themeMode || '#3880ff';

        this.language = settings.language;
    }

    initPage( translate : TranslateService){

        if (this.darkMode) {
            document.body.setAttribute('color-theme', 'dark');
        }
        else{
            document.body.setAttribute('color-theme', 'light');
        }
      
        translate.use(this.language); 
    }
}