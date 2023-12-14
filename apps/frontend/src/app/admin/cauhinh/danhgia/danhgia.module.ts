import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhgiaComponent } from './danhgia.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { DanhgiaDetailComponent } from './danhgia-detail/danhgia-detail.component';
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
    MatSelectModule,
    RouterModule.forChild([
      {
        path: '', component: DanhgiaComponent,
        children: [{
          path: ':id', component: DanhgiaDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [DanhgiaComponent,DanhgiaDetailComponent]
})
export class DanhgiaModule { }


