import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConceptorPageRoutingModule } from './conceptor-routing.module';

import { ConceptorPage } from './conceptor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConceptorPageRoutingModule
  ],
  declarations: [ConceptorPage]
})
export class ConceptorPageModule {}
