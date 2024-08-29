import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from './banner.component';
import { BannerChitietComponent } from './banner-chitiet/banner-chitiet.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { HinhanhModule } from '../../../shared/common/hinhanh/hinhanh.module';

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
        path: '', component: BannerComponent,
        children: [{
          path: ':id', component: BannerChitietComponent
        }]
    
      }
    ])
  ],
  declarations: [BannerComponent,BannerChitietComponent]
})
export class BannerModule { }


