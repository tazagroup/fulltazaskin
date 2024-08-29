import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTreeModule } from '@angular/material/tree';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { DichvuChitietComponent } from './dichvu-chitiet/dichvu-chitiet.component';
import { DichvuComponent } from './dichvu.component';
import { DichvuDanhmucComponent } from './dichvu-danhmuc/dichvu-danhmuc.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { HinhanhModule } from '../../shared/common/hinhanh/hinhanh.module';

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
    EditorModule,
    HinhanhModule,
    RouterModule.forChild([
      {
        path: '', component: DichvuComponent,
        children: [
          {path: 'chitiet/:id', component: DichvuChitietComponent},
          {path: 'danhmuc/:id', component: DichvuDanhmucComponent},
        ]
    
      }
    ])
  ],
  declarations: [DichvuComponent,DichvuChitietComponent,DichvuDanhmucComponent]
})
export class DanhmucModule { }
