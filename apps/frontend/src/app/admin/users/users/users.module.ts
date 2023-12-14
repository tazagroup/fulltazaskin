import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { MaterialModule } from '../../../shared/material.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EditorModule,
    MaterialModule,
    RouterModule.forChild([
      {
        path: '', component: UsersComponent,
        children: [{
          path: ':id', component: UsersDetailComponent
        }]
    
      }
    ])
  ],
  declarations: [UsersComponent,UsersDetailComponent]
})
export class UsersModule { }


