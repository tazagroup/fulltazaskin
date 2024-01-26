import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZalotokenComponent } from './zalotoken.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ZalotokenDetailComponent } from './zalotoken-detail/zalotoken-detail.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClipboardModule } from '@angular/cdk/clipboard';
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
    ClipboardModule,
    RouterModule.forChild([
      {
        path: '', component: ZalotokenComponent,
        children: [{
          path: ':id', component: ZalotokenDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [ZalotokenComponent,ZalotokenDetailComponent]
})
export class ZalotokenModule { }


