import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusListSetComponent } from './focus-list-set.component';

describe('FocusListSetComponent', () => {
  let component: FocusListSetComponent;
  let fixture: ComponentFixture<FocusListSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocusListSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusListSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
