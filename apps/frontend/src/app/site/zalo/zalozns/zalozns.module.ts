import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZaloznsComponent } from './zalozns.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ZaloznsDetailComponent } from './zalozns-detail/zalozns-detail.component';
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
        path: '', component: ZaloznsComponent,
        children: [{
          path: ':id', component: ZaloznsDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [ZaloznsComponent,ZaloznsDetailComponent]
})
export class ZaloznsModule { }


