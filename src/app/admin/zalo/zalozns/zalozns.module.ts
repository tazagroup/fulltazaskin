import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZaloznsComponent } from './zalozns.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ZaloznsDetailComponent } from './zalozns-detail/zalozns-detail.component';
import { MaterialModule } from '../../../shared/material.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: ZaloznsComponent,
        children: [{
          path: ':id', component: ZaloznsDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [ZaloznsComponent,ZaloznsDetailComponent]
})
export class ZaloznsModule { }


