import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhmucComponent } from './danhmuc.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DanhmucChitietComponent } from './danhmuc-chitiet/danhmuc-chitiet.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTreeModule,
    MatSidenavModule,
    MatMenuModule,
    RouterModule.forChild([
      {
        path: '', component: DanhmucComponent,
        children: [{
          path: ':id', component: DanhmucChitietComponent
        }]
    
      }
    ])
  ],
  declarations: [DanhmucComponent]
})
export class DanhmucModule { }
