import { Todo } from "../models/todo";
import { TranslateService } from "@ngx-translate/core";
import { LocalNotifications, ScheduleEvery } from '@capacitor/local-notifications';
import { Router } from '@angular/router';
import { TodoDate } from '../utils/todo-date';


export class TodoNotification {

    public static getNotifId(todo : Todo){

        if (!todo.notifId) {
  
          console.log("get notifId")
          // console.log(localStorage.getItem('notifId') || [])
  
          let notifId = JSON.parse(localStorage.getItem('notifId') || '[]');
  
          let newId = 0;
  
          for (let id of notifId) {
            
            if (id === newId) {
              newId = id + 1;
            }
            else{
              break;
            }
          }
  
          notifId.push(newId);
  
  
          console.log("set notifId : " + notifId)
      
          localStorage.setItem('notifId', JSON.stringify(notifId));
  
          todo.notifId = newId;
  
          return todo.notifId;
        }
        else{
          console.log("already notifId")
          return todo.notifId;
        }
      }
  

    public static async scheduleNotification(todo : Todo, router : Router) {
        try {
          console.log("schedule notification")
          let date = TodoDate.getDate(todo.date!, todo.time);
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
    
          // console.log("search notifId")
          let notifId = TodoNotification.getNotifId(todo);
  
          // console.log("notifId : " + notifId)

          let description = todo.description;
          if (!todo.description){
            description = '';
          }

          if (available) {

            const notificationData = {
              pageToNavigate: '/todo/'+todo.id, // Remplacez par le chemin de la page cible
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

                  title: `${todo.title} reminder`,
                  body: `${description}`,
                  id: notifId,
                  schedule: { at: date },
                  extra: notificationData,
                }
              ],
            });

            LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
              const clickedNotificationData = notification.notification.extra;

              todo.reminder = false;
              
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
  
  
      public static async scheduleRecurringNotification(todo: Todo, router : Router) {
        try {
          let date = TodoDate.getDate(todo.repeat!.startDate!, todo.repeat!.startTime);

          console.log(date)
          
          // Vérifier si les notifications sont disponibles
          const available = await LocalNotifications.requestPermissions();
  
          let notifId = TodoNotification.getNotifId(todo);
  
          let description = todo.description;
          if (!todo.description){
            description = '';
          }

          let repeat : ScheduleEvery = todo.repeat!.delayType!;

          console.log(repeat)

  
          if (available) {

            const notificationData = {
              pageToNavigate: '/todo/'+todo.id, // Remplacez par le chemin de la page cible
              // Autres données de notification
            };

            console.log(date)
  
            // Planifier la notification
            await LocalNotifications.schedule({
              notifications: [
                {
                  smallIcon: 'res://drawable/check_mark_green',
                  largeIcon: 'res://drawable/check_mark_green',

                  title: `${todo.title} reminder`,
                  body: `${description}`,
                  id: notifId,
                  schedule: { 
                    repeats: true,
                    at: date,
                    every: repeat},
                  extra: notificationData,
                }
              ],
            });

            LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
              const clickedNotificationData = notification.notification.extra;
              
              // Vérifiez si des données supplémentaires existent et contiennent la page à laquelle naviguer
              if (clickedNotificationData && clickedNotificationData.pageToNavigate) {
                const pageToNavigate = clickedNotificationData.pageToNavigate;
                router.navigate([pageToNavigate]);
              }
            });
            
          }
          return true;

        } catch (error) {
          console.error('Erreur lors de la planification de la notification', error);
          return false;
        }
      }
  
  
      public static async cancelNotification(todo : Todo) {
        try {
          console.log("remove notification");
  
          if (!todo.notifId) return false;
          await LocalNotifications.cancel({ notifications: [{ id: todo.notifId! }] });
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