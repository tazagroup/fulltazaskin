import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DashboardZalodanhgiaComponent } from './dashboard-zalodanhgia/dashboard-zalodanhgia.component';
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
    DashboardZalodanhgiaComponent,
    RouterModule.forChild([
      {
        path: '', component: DashboardComponent,    
      }
    ])
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }


