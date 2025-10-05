import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneConsumptionsComponent } from './phone-consumptions.component';

describe('PhoneConsumptionsComponent', () => {
  let component: PhoneConsumptionsComponent;
  let fixture: ComponentFixture<PhoneConsumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoneConsumptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneConsumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
