/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ZnsthanhtoanadminComponent } from './znsthanhtoanadmin.component';

describe('ZnsthanhtoanadminComponent', () => {
  let component: ZnsthanhtoanadminComponent;
  let fixture: ComponentFixture<ZnsthanhtoanadminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZnsthanhtoanadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZnsthanhtoanadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
