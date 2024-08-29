/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DichvuChitietComponent } from './dichvu-chitiet.component';

describe('DichvuChitietComponent', () => {
  let component: DichvuChitietComponent;
  let fixture: ComponentFixture<DichvuChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DichvuChitietComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DichvuChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
