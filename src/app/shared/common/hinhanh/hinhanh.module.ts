import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HinhanhComponent } from './hinhanh.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule
  ],
  declarations: [HinhanhComponent],
  exports:[HinhanhComponent]
})
export class HinhanhModule { }
