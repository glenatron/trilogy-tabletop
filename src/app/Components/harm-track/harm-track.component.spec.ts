import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarmTrackComponent } from './harm-track.component';

describe('HarmTrackComponent', () => {
  let component: HarmTrackComponent;
  let fixture: ComponentFixture<HarmTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HarmTrackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HarmTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
