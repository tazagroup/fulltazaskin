/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashboardXacnhanthanhtoanComponent } from './dashboard-xacnhanthanhtoan.component';

describe('DashboardXacnhanthanhtoanComponent', () => {
  let component: DashboardXacnhanthanhtoanComponent;
  let fixture: ComponentFixture<DashboardXacnhanthanhtoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardXacnhanthanhtoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardXacnhanthanhtoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
