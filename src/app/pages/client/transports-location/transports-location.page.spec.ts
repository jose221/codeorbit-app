import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransportsLocationPage } from './transports-location.page';

describe('TransportsLocationPage', () => {
  let component: TransportsLocationPage;
  let fixture: ComponentFixture<TransportsLocationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TransportsLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
