import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KhachhangComponent } from './khachhang.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {
        path: '', component: KhachhangComponent,
        // children: [{
        //   path: ':id', component: PhanloaidaChitietComponent
        // }]
    
      }
    ])
  ],
  declarations: [KhachhangComponent]
})
export class KhachhangModule { }
