/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChinhanhChitietComponent } from './chinhanh-chitiet.component';

describe('ChinhanhChitietComponent', () => {
  let component: ChinhanhChitietComponent;
  let fixture: ComponentFixture<ChinhanhChitietComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChinhanhChitietComponent ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChinhanhChitietComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
