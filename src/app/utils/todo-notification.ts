// import { Todo } from "../models/todo";
import { TranslateService } from "@ngx-translate/core";
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { TodoDate } from '../utils/todo-date';
import { MainTodo } from "../models/todo/main-todo";
import { SubTodo } from "../models/todo/sub-todo";


export class TodoNotification {

    public static getNotifId(todo : MainTodo | SubTodo){

        if (!todo.properties.notifId) {
  
          console.log("get notifId")
          // console.log(localStorage.getItem('notifId') || [])
  
          let notifId = Math.floor(Math.random() * (2 ** 31));

          todo.properties.notifId = notifId;

          console.log("notifId", notifId)
  
          return todo.properties.notifId;
        }
        else{
          console.log("already notifId")
          return todo.properties.notifId;
        }
      }
  

    public static async scheduleNotification(todo : MainTodo | SubTodo, router : Router) {
        try {
          
          console.log("schedule notification")
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
    
          if (available) {

            let date = TodoDate.getDate(todo.properties.date!, todo.properties.time);
            let notifId = TodoNotification.getNotifId(todo);

            let description = todo.properties.description;
            if (!todo.properties.description){
              description = '';
            }

            // SET REPEAT IF TODO.REPEAT IS DEFINED

            let repeatEvery : ScheduleEvery | undefined = undefined;
            let repeat = false;

            if (todo.properties.repeat && todo.properties.repeat.delayType){
              repeatEvery  = todo.properties.repeat!.delayType!;
              // repeatEvery  = 'second';

              repeat = true;

              date = TodoDate.getDate(todo.properties.repeat!.startDate!, todo.properties.repeat!.startTime);
            }

            let schedule = { 
              repeats: repeat,
              at: date,
              every: repeatEvery,
            };

            const notificationData = {
              pageToNavigate: '/tabs/todo/'+todo.id, // Remplacez par le chemin de la page cible
              // Autres données de notification
            };

            console.log("notification available")

            console.log(date)
    
            // Planifier la notification
            await LocalNotifications.schedule({
              notifications: [
                {
                  smallIcon: 'res://drawable/check_mark_green',
                  largeIcon: 'res://drawable/check_mark_green',

                  title: `${todo.properties.title} reminder`,
                  body: `${description}`,
                  id: notifId,
                  schedule: schedule,
                  extra: notificationData,
                }
              ],
            });

            LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
              

              console.log('Notification action performed', notification, todo.properties.title)

              const clickedNotificationData = notification.notification.extra;

              // TODO : verif actualization on todo page
              // todo.reminder = false;
              
              // Vérifiez si des données supplémentaires existent et contiennent la page à laquelle naviguer
              if (clickedNotificationData && clickedNotificationData.pageToNavigate) {
                const pageToNavigate = clickedNotificationData.pageToNavigate;
                router.navigate([pageToNavigate]);
              }
            });

          }
          return true;

        } 
        catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
          return false;
        }
      }
  
  
      public static async cancelNotification(todo : MainTodo | SubTodo) {
        try {
          console.log("remove notification");
  
          if (!todo.properties.notifId) return false;
          await LocalNotifications.cancel({ notifications: [{ id: todo.properties.notifId! }] });
          return true;
        } catch (error) {
          console.error('Erreur lors de l`annulation de la notification', error);
          return false;
        }
      }

      public static async cancelNotificationById(id : number) {
        try {
          console.log("remove notification");
  
          await LocalNotifications.cancel({ notifications: [{ id: id }] });
          return true;
        } catch (error) {
          console.error('Erreur lors de l`annulation de la notification', error);
          return false;
        }
      }

}