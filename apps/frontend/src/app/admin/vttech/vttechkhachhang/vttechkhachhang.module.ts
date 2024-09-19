import { VttechkhachhangdetailComponent } from './vttechkhachhangdetail/vttechkhachhangdetail.component';
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
import { MatTableModule } from '@angular/material/table';
import { VttechdieutrilistComponent } from '../vttechdieutri/vttechdieutrilist/vttechdieutrilist.component';
import { VttechkhachhanglistComponent } from './vttechkhachhanglist/vttechkhachhanglist.component';
import { VttechthanhtoanDetailComponent } from '../vttechthanhtoan/vttechthanhtoan-detail/vttechthanhtoan-detail.component';
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
    MatTableModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'vttech', pathMatch: 'full' },
      {
        path: 'vttech',
        component: VttechkhachhanglistComponent,
      },
      {
        path: 'vttech/:id',
        component: VttechkhachhangdetailComponent,
      }
      // {
      //   path: '', component: VttechkhachhangComponent,
      //   // children: [{
      //   //   path: ':id', component: VttechkhachhangDetailComponent
      //   // }]

      // }
    ]),
  ],
  declarations: [VttechkhachhangComponent,VttechkhachhangdetailComponent],
})
export class VttechkhachhangModule {}
