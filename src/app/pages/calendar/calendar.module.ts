import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
//import { NgCalendarModule } from 'ionic2-calendar';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { NgCalendarModule } from './src/calendar.module';
import { SharedModule } from 'src/app/shared/shared.module';



registerLocaleData(localeFr, 'fr');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    NgCalendarModule,
    SharedModule,
  ],
  declarations: [CalendarPage]
})
export class CalendarPageModule {}
