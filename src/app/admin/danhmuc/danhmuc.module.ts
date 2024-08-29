import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhmucComponent } from './danhmuc.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DanhmucChitietComponent } from './danhmuc-chitiet/danhmuc-chitiet.component';
import { HinhanhModule } from '../../shared/common/hinhanh/hinhanh.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MatSidenavModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    HinhanhModule,
    RouterModule.forChild([
      {
        path: '', component: DanhmucComponent,
        children: [{
          path: ':id', component: DanhmucChitietComponent
        }]
    
      }
    ])
  ],
  declarations: [DanhmucComponent,DanhmucChitietComponent]
})
export class DanhmucModule { }


