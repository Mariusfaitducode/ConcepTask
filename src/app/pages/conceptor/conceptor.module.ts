import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConceptorPageRoutingModule } from './conceptor-routing.module';

import { ConceptorPage } from './conceptor.page';
import { NodeModalComponent } from 'src/app/component/node-modal/node-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConceptorPageRoutingModule,
    SharedModule
  ],
  declarations: [ConceptorPage]
})
export class ConceptorPageModule {}
