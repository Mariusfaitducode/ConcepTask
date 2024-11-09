import { CapacitorConfig } from '@capacitor/cli';
import { LocalNotifications } from '@capacitor/local-notifications';

import { environment } from './src/environments/environment';



const config: CapacitorConfig = {
  appId: 'fr.marscode.todolist',
  appName: 'ToDoList',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    hostname: 'localhost'
  },
  
  plugins: {
    LocalNotifications: {
      // smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      // sound: "beep.wav"
    }
  }
  
};



export default config;
