import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomConfigComponent } from './custom-config.component';
import { TestingModule } from 'src/app/test-helpers';

describe('CustomConfigComponent', () => {
  let component: CustomConfigComponent;
  let fixture: ComponentFixture<CustomConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomConfigComponent ],
      imports: [
        TestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
