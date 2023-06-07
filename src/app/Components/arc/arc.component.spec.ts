import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcComponent } from './arc.component';

describe('ArcComponent', () => {
  let component: ArcComponent;
  let fixture: ComponentFixture<ArcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
