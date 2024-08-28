import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

// Mock services
export const mockActivatedRoute = {
    paramMap: of(convertToParamMap({})),
    queryParams: of({}),
    snapshot: {
      paramMap: convertToParamMap({}),
      queryParams: {}
    }
};

export const mockAngularFirestore = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']);

@NgModule({
  imports: [
    IonicModule.forRoot(),
    TranslateModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    TranslateService,
    { provide: ActivatedRoute, useValue: mockActivatedRoute },
    { provide: AngularFirestore, useValue: mockAngularFirestore }
  ],
  exports: [
    IonicModule,
    TranslateModule
  ]
})
export class TestingModule { }
