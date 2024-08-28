import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackPage } from './feedback.page';
import { TestingModule } from 'src/app/test-helpers';

describe('FeedbackPage', () => {
  let component: FeedbackPage;
  let fixture: ComponentFixture<FeedbackPage>;

  beforeEach(async(async () => {

    await TestBed.configureTestingModule({
      declarations: [FeedbackPage],
      imports: [
        TestingModule
      ],
    }).compileComponents();


    fixture = TestBed.createComponent(FeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
