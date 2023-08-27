import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadarBlePage } from './radar-ble.page';

describe('RadarBlePage', () => {
  let component: RadarBlePage;
  let fixture: ComponentFixture<RadarBlePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RadarBlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
