import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusContainerComponent } from './focus-container.component';

describe('FocusContainerComponent', () => {
  let component: FocusContainerComponent;
  let fixture: ComponentFixture<FocusContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocusContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
