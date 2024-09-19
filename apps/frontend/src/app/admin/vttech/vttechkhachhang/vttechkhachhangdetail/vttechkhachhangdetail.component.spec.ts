/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VttechkhachhangdetailComponent } from './vttechkhachhangdetail.component';

describe('VttechkhachhangdetailComponent', () => {
  let component: VttechkhachhangdetailComponent;
  let fixture: ComponentFixture<VttechkhachhangdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VttechkhachhangdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VttechkhachhangdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
