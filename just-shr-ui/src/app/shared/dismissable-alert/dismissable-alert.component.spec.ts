import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DismissableAlertComponent } from './dismissable-alert.component';

describe('DismissableAlertComponent', () => {
  let component: DismissableAlertComponent;
  let fixture: ComponentFixture<DismissableAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DismissableAlertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DismissableAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
