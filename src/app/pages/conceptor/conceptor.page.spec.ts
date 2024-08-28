import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptorPage } from './conceptor.page';

describe('ConceptorPage', () => {
  let component: ConceptorPage;
  let fixture: ComponentFixture<ConceptorPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConceptorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
