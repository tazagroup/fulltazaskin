import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhachhangdichvuComponent } from './khachhangdichvu.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'apps/frontend/src/app/shared/material.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: KhachhangdichvuComponent,    
      }
    ])
  ],
  declarations: [KhachhangdichvuComponent]
})
export class KhachhangdichvuModule { }


