import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VttechkhachhangComponent } from './vttechkhachhang.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    MatDatepickerModule,
    MatSelectModule,
    MatPaginatorModule,
    RouterModule.forChild([
      {
        path: '', component: VttechkhachhangComponent,
        // children: [{
        //   path: ':id', component: VttechkhachhangDetailComponent
        // }]
    
      }
    ])
  ],
  declarations: [VttechkhachhangComponent]
})
export class VttechkhachhangModule { }


