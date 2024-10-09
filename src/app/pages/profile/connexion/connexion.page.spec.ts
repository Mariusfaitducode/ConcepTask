import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnexionPage } from './connexion.page';

describe('LogInPage', () => {
  let component: ConnexionPage;
  let fixture: ComponentFixture<ConnexionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConnexionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});