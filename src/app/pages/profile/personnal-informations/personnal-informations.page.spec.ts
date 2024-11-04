import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonnalInformationsPage } from './personnal-informations.page';

describe('PersonnalInformationsPage', () => {
  let component: PersonnalInformationsPage;
  let fixture: ComponentFixture<PersonnalInformationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonnalInformationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
