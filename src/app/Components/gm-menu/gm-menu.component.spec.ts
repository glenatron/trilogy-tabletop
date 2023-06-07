import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmMenuComponent } from './gm-menu.component';

describe('GmMenuComponent', () => {
  let component: GmMenuComponent;
  let fixture: ComponentFixture<GmMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
