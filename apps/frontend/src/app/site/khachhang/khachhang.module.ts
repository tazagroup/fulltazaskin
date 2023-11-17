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
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { KhachhangChitietComponent } from './khachhang-chitiet/khachhang-chitiet.component';

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
    MatSidenavModule,
    MatSortModule,
    RouterModule.forChild([
      {
        path: '', component: KhachhangComponent,
        children: [{
          path: ':SDT', component: KhachhangChitietComponent
        }]
    
      }
    ])
  ],
  declarations: [KhachhangComponent,KhachhangChitietComponent]
})
export class KhachhangModule { }
