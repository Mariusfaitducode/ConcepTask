import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonnalInformationsPageRoutingModule } from './personnal-informations-routing.module';

import { PersonnalInformationsPage } from './personnal-informations.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonnalInformationsPageRoutingModule,

    SharedModule
  ],
  declarations: [PersonnalInformationsPage]
})
export class PersonnalInformationsPageModule {}
