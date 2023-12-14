import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VttechthanhtoanComponent } from './vttechthanhtoan.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { VttechthanhtoanDetailComponent } from './vttechthanhtoan-detail/vttechthanhtoan-detail.component';
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
    RouterModule.forChild([
      {
        path: '', component: VttechthanhtoanComponent,
        children: [{
          path: ':id', component: VttechthanhtoanDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [VttechthanhtoanComponent,VttechthanhtoanDetailComponent]
})
export class VttechthanhtoanModule { }


