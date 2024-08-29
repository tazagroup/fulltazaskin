import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LichhenComponent } from './lichhen.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { LichhenDetailComponent } from './lichhen-detail/lichhen-detail.component';
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
        path: '', component: LichhenComponent,
        children: [{
          path: ':id', component: LichhenDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [LichhenComponent,LichhenDetailComponent]
})
export class LichhenModule { }


