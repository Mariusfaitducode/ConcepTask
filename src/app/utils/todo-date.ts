// import { Todo } from "../models/todo";
import { TranslateService } from "@ngx-translate/core";
import { MainTodo } from "../models/todo/main-todo";
import { SubTodo } from "../models/todo/sub-todo";



export class TodoDate {



    public static getFormattedDateFromYearMonthDay(year: string, month: string, day: string) {

      console.log("getFormattedDateFromYearMonthDay")

      // Convert month to a number and add 1 (JavaScript months are 0-indexed)
      const monthNumber = parseInt(month, 10) + 1;
      // Convert back to string and ensure it's two digits
      const formattedMonth = monthNumber.toString().padStart(2, '0');
      // Ensure month and day are two digits // +1 because month is 0 based
      const formattedDay = day.padStart(2, '0');

      // Create the formatted date string
      const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;

      return formattedDate;
    }





    // DATE

    public static getDate(newDate: Date | string, newTime?: string) {
        let date = new Date(newDate);
  
          if (newTime) {
            let time = newTime!.split(':');
            const hours = parseInt(time[0], 10); // Convertissez l'heure en entier
            const minutes = parseInt(time[1], 10);
            
            date.setHours(hours);
            date.setMinutes(minutes);
          }
          else{
            date.setHours(8);
            date.setMinutes(0);
          }
          return date;
      }
  
  
      public static isDateInRepeat(todo : MainTodo | SubTodo, date : Date ){
  
        let startDate = this.getDate(todo.properties.repeat?.startDate!);
  
        while(true){
  
          if (this.sameDates(startDate, date)) {
            return true;
          }
          else if (startDate < date) {
  
            if (todo.properties.repeat!.delayType == "day") {
              startDate.setDate(startDate.getDate() + 1);
            }
            else if (todo.properties.repeat!.delayType == "week") {
              startDate.setDate(startDate.getDate() + 7);
            }
            else if (todo.properties.repeat!.delayType == "two-weeks") {
              startDate.setDate(startDate.getDate() + 14);
            }
            else if (todo.properties.repeat!.delayType == "month") {
              startDate.setMonth(startDate.getMonth() + 1);
            }
            else if (todo.properties.repeat!.delayType == "year") {
              startDate.setFullYear(startDate.getFullYear() + 1);
            }
          }
          else{
            return false;
          }
        }
      }
  
      public static sameDates(date1 : Date, date2 : Date){
        // Extraire les parties de la date (année, mois, jour) pour chaque date
        const annee1 = date1.getFullYear();
        const mois1 = date1.getMonth();
        const jour1 = date1.getDate();
      
        const annee2 = date2.getFullYear();
        const mois2 = date2.getMonth();
        const jour2 = date2.getDate();
      
        // Comparer les parties de la date
        return annee1 === annee2 && mois1 === mois2 && jour1 === jour2;
      }
  
  
      public static passedDate(todo : MainTodo | SubTodo){

        // console.log('Todo properties', todo.properties)
  
        if (todo.properties.config.date && todo.properties.date) {
          let date = new Date(todo.properties.date);
  
          if (todo.properties.time) {
            let time = todo.properties.time!.split(':');
            const hours = parseInt(time[0], 10); // Convertissez l'heure en entier
            const minutes = parseInt(time[1], 10);
            
            date.setHours(hours);
            date.setMinutes(minutes);
          }
  
          let now = new Date();
    
          if (date < now) {
            return true;
          }
        }
        
        else if (todo.properties.config.repeat && todo.properties.repeat?.startDate) {
          let date = new Date(todo.properties.repeat.startDate);
  
          if (todo.properties.repeat.startTime) {
            let time = todo.properties.repeat.startTime!.split(':');
            const hours = parseInt(time[0], 10); // Convertissez l'heure en entier
            const minutes = parseInt(time[1], 10);
            
            date.setHours(hours);
            date.setMinutes(minutes);
          }
  
          let now = new Date();
    
          if (date < now) {
            return true;
          }
        }
        return false;
  
      }
  
      public static formatDateToCustomString(todo : MainTodo | SubTodo, translate : TranslateService | null = null) {
  
        // console.log(translate)

        if (!todo.properties.config.date && !todo.properties.config.repeat) return null;

        if (todo.properties.config.date && !todo.properties.date) return 'Date not defined';

        if (todo.properties.config.repeat && !todo.properties.repeat?.startDate) return 'Date not defined';
  
        let daysOfWeek : string[] = []
        let months : string[] = []
  
        const daysOfWeekEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
        const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthsFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      
        if (translate && translate.store.currentLang == "fr") {
          months = monthsFr;
          daysOfWeek = dayOfWeekFr;
        }
        else{
          months = monthsEn;
          daysOfWeek = daysOfWeekEn;
        }
  
  
        if (todo.properties.config.date){
    
          let date = this.getDate(todo.properties.date!, todo.properties.time);
    
          const day = daysOfWeek[date!.getDay()];
          const dayOfMonth = date!.getDate();
          const month = months[date!.getMonth()];
          const hours = String(date!.getHours()).padStart(2, '0');
          const minutes = String(date!.getMinutes()).padStart(2, '0');
        
          return `${day}, ${dayOfMonth} ${month} ${hours}:${minutes}`;
        }
        if (todo.properties.config.repeat && todo.properties.repeat!.delayType){
    
          let date = this.getDate(todo.properties.repeat?.startDate!, todo.properties.repeat?.startTime);
    
          const day = daysOfWeek[date!.getDay()];
          const dayOfMonth = date!.getDate();
          const month = months[date!.getMonth()];
          const hours = String(date!.getHours()).padStart(2, '0');
          const minutes = String(date!.getMinutes()).padStart(2, '0');
  
          const translateKey = `repeat.${todo.properties.repeat!.delayType}`
          const translationParams = { day, dayOfMonth, month, hours, minutes }
  
          if (translate) {
            return translate.instant(translateKey, translationParams);
          }
  
          if (todo.properties.repeat!.delayType == "day") {
            return `Repeat every day at ${hours}:${minutes}`;
          }
          if (todo.properties.repeat!.delayType == "week") {
            return `Repeat every week on ${day} at ${hours}:${minutes}`;
          }
          if (todo.properties.repeat!.delayType == "two-weeks") {
            return `Repeat every two weeks on ${day} at ${hours}:${minutes}`;
          }
          if (todo.properties.repeat!.delayType == "month") {
            return `Repeat every month on ${dayOfMonth} at ${hours}:${minutes}`;
          }
          if (todo.properties.repeat!.delayType == "year") {
            return `Repeat every year on ${dayOfMonth} ${month} at ${hours}:${minutes}`;
          }
          // return `Repeat every ${todo.repeat!.delayType}`;
        }
        return null; 
      }
}