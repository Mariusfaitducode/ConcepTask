import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonnalInformationsPageRoutingModule } from './personnal-informations-routing.module';

import { PersonnalInformationsPage } from './personnal-informations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonnalInformationsPageRoutingModule
  ],
  declarations: [PersonnalInformationsPage]
})
export class PersonnalInformationsPageModule {}
