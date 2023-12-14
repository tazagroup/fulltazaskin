import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauhinhComponent } from './cauhinh.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule.forChild([
      {
        path: '', component: CauhinhComponent,  
        children:[
          { path: 'hang-thanh-vien', loadChildren: () => import('./hangthanhvien/hangthanhvien.module').then(m => m.HangthanhvienModule) },
          { path: 'chi-nhanh', loadChildren: () => import('./chinhanh/chinhanh.module').then(m => m.ChinhanhModule) },
          { path: 'banner', loadChildren: () => import('./banner/banner.module').then(m => m.BannerModule) },
          { path: 'navigate', loadChildren: () => import('./navigate/navigate.module').then(m => m.NavigateModule) },
          { path: 'khuyenmai', loadChildren: () => import('./khuyenmai/khuyenmai.module').then(m => m.KhuyenmaiModule) },
          { path: 'danh-gia', loadChildren: () => import('../cauhinh/danhgia/danhgia.module').then(m => m.DanhgiaModule)},
          { path: 'cauhinhchung', loadChildren: () => import('../cauhinh/cauhinhchung/cauhinhchung.module').then(m => m.CauhinhchungModule)},
          { path: 'menu', loadChildren: () => import('../cauhinh/menu/menu.module').then(m => m.MenuModule)},
        ]
      },
 
    ])
  ],
  declarations: [CauhinhComponent]
})
export class CauhinhModule { }
